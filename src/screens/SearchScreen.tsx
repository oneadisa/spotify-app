import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  FlatList,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoreIcon from '../components/icons/more';
import { usePlaylists } from '../contexts/PlaylistContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import NowPlayingBar from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import More from '@/components/icons/more.tsx';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useAuth } from '../contexts/AuthContext';
import { getTrackPreview, useAudioPlayer } from '../services/audioService';
import { usePlayback } from '../contexts/PlaybackContext';
import { showToast } from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import genre images
const cozyImg = require('../../assets/images/searchscreen/genres/cozy.png');
const koreanIndieImg = require('../../assets/images/searchscreen/genres/korean_indie.png');
const healingImg = require('../../assets/images/searchscreen/genres/healing.png');

const SpotifySearchScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { getCurrentUserProfile, search, isLoading, error, addTracksToPlaylist, getUserPlaylists } = useSpotifyApi();
  const { isAuthenticated, profileImage } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const { isPlaying, isLoading: audioLoading, play, stop } = useAudioPlayer();
  const { previewTrackId } = usePlayback();
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [searchInputRef, setSearchInputRef] = useState<any>(null);
  const [inputLayout, setInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // Load search history from AsyncStorage
  useEffect(() => {
    (async () => {
      const history = await AsyncStorage.getItem('searchHistory');
      setSearchHistory(history ? JSON.parse(history) : []);
    })();
  }, []);

  // Save search to history (for queries)
  const saveSearchToHistory = async (q: string) => {
    if (!q.trim()) return;
    let updated = [{ type: 'query', value: q }, ...searchHistory.filter(item => !(item.type === 'query' && item.value === q))];
    // Filter out blank entries
    updated = updated.filter(item => {
      if (item.type === 'query') return !!item.value && item.value.trim();
      return !!item.name && item.name.trim() && !!item.id;
    });
    if (updated.length > 6) updated = updated.slice(0, 6);
    setSearchHistory(updated);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  // Save visited item to history (artist, track, album, playlist)
  const saveVisitedToHistory = async (item: any) => {
    // Only save if name and id are present and non-empty
    if (!item.name || !item.name.trim() || !item.id) return;
    let updated = [item, ...searchHistory.filter(h => !(h.type === item.type && h.id === item.id))];
    // Filter out blank entries
    updated = updated.filter(h => {
      if (h.type === 'query') return !!h.value && h.value.trim();
      return !!h.name && h.name.trim() && !!h.id;
    });
    if (updated.length > 20) updated = updated.slice(0, 20);
    setSearchHistory(updated);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  // When a search is performed
  useEffect(() => {
    if (!searching && query && results) {
      saveSearchToHistory(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, results]);

  useEffect(() => {
    if (!query) {
      setResults(null);
      setSearchError(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    setSearchError(null);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(async () => {
      try {
        const res = await search(query, ['track', 'artist', 'album', 'playlist'], { limit: 5 });
        setResults(res);
        setSearchError(null);
      } catch (e: any) {
        setSearchError(e?.message || 'Search failed');
        setResults(null);
      } finally {
        setSearching(false);
      }
    }, 500);
    setDebounceTimeout(timeout);
    // Cleanup
    return () => clearTimeout(timeout);
  }, [query]);

  const genres = [
    {
      id: 1,
      title: '#cozy',
      color: '#8E6A5B',
      image: cozyImg,
    },
    {
      id: 2,
      title: '#korean indie',
      color: '#777777',
      image: koreanIndieImg,
    },
    {
      id: 3,
      title: '#healing',
      color: '#B8860B',
      image: healingImg,
    },
  ];

  const GenreTile = ({ item }: { item: { id: number; title: string; color: string; image: any } }) => (
    <TouchableOpacity style={[styles.genreTile,]}>
      <Text style={styles.genreTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.genreImage} />
    </TouchableOpacity>
  );

  // Handle play/pause for track preview (improved to match PlaylistScreen)
  const handlePreview = async (track: any) => {
    if (!track || !track.id) return;
    // If this track is currently previewing, stop it
    if (isPlaying && previewTrackId === track.id) {
      await stop();
      return;
    }
    // If no preview URL is available, show an error
    let previewUrl = track.preview_url;
    if (!previewUrl) {
      // Try to fetch preview from Deezer as fallback
      previewUrl = await getTrackPreview(track.artists?.[0]?.name || '', track.name);
    }
    if (!previewUrl) {
      showToast('No preview available for this track.', 'error');
      return;
    }
    try {
      await play(previewUrl, {
        id: track.id,
        title: track.name,
        artist: track.artists?.map((a: any) => a?.name).filter(Boolean).join(', '),
        artwork: track.album?.images?.[0]?.url,
        artistId: track.artists?.[0]?.id || null,
      });
    } catch (e: any) {
      showToast(e?.message || 'Failed to play preview', 'error');
      console.error('Preview error:', e);
    }
  };

  const handleMorePress = async (track: any) => {
    setSelectedTrack(track);
    setIsLoadingPlaylists(true);
    setIsPlaylistModalVisible(true);

    try {
      // Fetch user's playlists
      const playlists = await getUserPlaylists(50); // Get up to 50 playlists
      setUserPlaylists(playlists.items || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      Alert.alert('Error', 'Failed to load your playlists');
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedTrack) return;

    try {
      await addTracksToPlaylist(playlistId, [`spotify:track:${selectedTrack.id}`]);
      Alert.alert('Success', 'Track added to playlist!');
      setIsPlaylistModalVisible(false);
    } catch (err) {
      console.error('Error adding track to playlist:', err);
      Alert.alert('Error', 'Failed to add track to playlist');
    }
  };

  // Helper to render icon for history type
  const renderHistoryIcon = (type: string) => {
    switch (type) {
      case 'artist': return <Ionicons name="person" size={18} color="#b3b3b3" style={{ marginRight: 8 }} />;
      case 'track': return <Ionicons name="musical-notes" size={18} color="#b3b3b3" style={{ marginRight: 8 }} />;
      case 'album': return <Ionicons name="albums" size={18} color="#b3b3b3" style={{ marginRight: 8 }} />;
      case 'playlist': return <Ionicons name="list" size={18} color="#b3b3b3" style={{ marginRight: 8 }} />;
      default: return <Ionicons name="search" size={18} color="#b3b3b3" style={{ marginRight: 8 }} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setIsSearchBarFocused(false);
        }}
        accessible={false}
      >
        <View style={{ flex: 1 }} pointerEvents="box-none">
          {/* Floating search history dropdown */}
          {isSearchBarFocused && searchHistory.length > 0 && !query && inputLayout && (
            <View
              style={[
                styles.historyDropdown,
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: (inputLayout?.y || 0) + (inputLayout?.height || 0),
                  width: '100%',
                  zIndex: 100,
                  elevation: 10,
                  backgroundColor: '#000',
                  borderRadius: 12,
                  padding: 0,
                  marginTop: 70,
                  marginBottom: 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  borderWidth: 0,
                },
              ]}
              pointerEvents="box-none"
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 16, marginTop: 16, marginBottom: 8 }}>Recent searches</Text>
              {searchHistory.slice(0, 6).map((item, idx) => (
                <React.Fragment key={item.type + (item.id || item.value) + idx}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#000' }}>
                    {/* Image */}
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={{ width: 40, height: 40, borderRadius: item.type === 'artist' ? 20 : 8, marginRight: 12 }} />
                    ) : (
                      <View style={{ width: 40, height: 40, borderRadius: item.type === 'artist' ? 20 : 8, marginRight: 12, backgroundColor: '#232323', justifyContent: 'center', alignItems: 'center' }}>
                        {renderHistoryIcon(item.type)}
                      </View>
                    )}
                    {/* Title and subtitle */}
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        if (item.type === 'query') {
                          setQuery(item.value);
                        } else if (item.type === 'artist') {
                          navigation.navigate('Artist', { id: item.id, name: item.name });
                        } else if (item.type === 'track') {
                          setQuery(item.name);
                        } else if (item.type === 'album') {
                          navigation.navigate('Album', { id: item.id, name: item.name });
                        } else if (item.type === 'playlist') {
                          navigation.navigate('Playlist', { id: item.id, name: item.name });
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }} numberOfLines={1}>
                        {item.type === 'query' ? item.value : item.name}
                      </Text>
                      <Text style={{ color: '#b3b3b3', fontSize: 13, marginTop: 2 }} numberOfLines={1}>
                        {item.type === 'artist' && 'Artist'}
                        {item.type === 'track' && (item.artist ? `Song • ${item.artist}` : 'Song')}
                        {item.type === 'album' && 'Album'}
                        {item.type === 'playlist' && 'Playlist'}
                      </Text>
                    </TouchableOpacity>
                    {/* Remove (X) button */}
                    <TouchableOpacity
                      onPress={() => {
                        const updated = searchHistory.filter((h, i) => i !== idx);
                        setSearchHistory(updated);
                        AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
                      }}
                      style={{ marginLeft: 8, padding: 8 }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close" size={20} color="#b3b3b3" />
                    </TouchableOpacity>
                  </View>
                  {/* Separator */}
                  {idx < Math.min(searchHistory.length, 6) - 1 && (
                    <View style={{ height: 1, backgroundColor: '#fff', opacity: 0.08, marginLeft: 16, marginRight: 16 }} />
                  )}
                </React.Fragment>
              ))}
              {/* Clear all button */}
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  marginTop: 8,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#b3b3b3',
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  backgroundColor: 'transparent',
                }}
                onPress={() => {
                  setSearchHistory([]);
                  AsyncStorage.setItem('searchHistory', JSON.stringify([]));
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '500' }}>Clear recent searches</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
              <BackButton />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => { navigation.navigate('User'); showToast('Profile opened', 'info'); }}>
                <Image
                  source={profileImage ? { uri: profileImage } : require('../../assets/images/profile_picture.png')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Search</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View
                style={styles.searchBar}
                onLayout={e => setInputLayout(e.nativeEvent.layout)}
              >
                <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
                <TextInput
                  ref={ref => setSearchInputRef(ref)}
                  style={styles.searchInput}
                  placeholder="What do you want to listen to?"
                  placeholderTextColor="#666"
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                  onFocus={() => setIsSearchBarFocused(true)}
                  onBlur={() => setIsSearchBarFocused(false)}
                />
              </View>
            </View>

            {/* Search Results */}
            {searching && (
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text style={{ color: '#fff' }}>Searching...</Text>
              </View>
            )}
            {searchError && (
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text style={{ color: 'red' }}>{searchError}</Text>
              </View>
            )}
            {results && (
                            <ScrollView
                style={styles.searchResultsContainer}
                contentContainerStyle={styles.resultsContentContainer}
                showsVerticalScrollIndicator={false}
              >
                {/* Tracks */}
                {results.tracks && results.tracks.items.length > 0 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Tracks</Text>
                    {results.tracks.items.filter(Boolean).map((track: any) => {
                      if (!track || !track.id) return null;
                      return (
                        <View key={track.id} style={styles.browseCardAesthetic}>
                          <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                            activeOpacity={0.8}
                            onPress={() => saveVisitedToHistory({ type: 'track', id: track.id, name: track.name })}
                          >
                            <Image
                              source={
                                track.album?.images && Array.isArray(track.album.images) && track.album.images[0]?.url
                                  ? { uri: track.album.images[0].url }
                                  : require('../../assets/images/profile_picture.png')
                              }
                              style={[styles.browseImage, { borderRadius: 8 }]}
                            />
                            <View style={styles.browseContent}>
                              <Text style={styles.browseTitle}>{track?.name || 'Unknown Track'}</Text>
                              {track.artists && track.artists.length > 0 && (
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                  onPress={() => {
                                    const firstArtist = track.artists[0];
                                    if (firstArtist && firstArtist.id) {
                                      try {
                                        navigation.navigate('Artist', {
                                          id: firstArtist.id,
                                          name: firstArtist.name || 'Unknown Artist'
                                        });
                                        saveVisitedToHistory({ type: 'artist', id: firstArtist.id, name: firstArtist.name });
                                      } catch (error) { }
                                    }
                                  }}
                                >
                                  <Text style={[styles.browseArtist, { textDecorationLine: 'underline' }]}>
                                    {track.artists.filter(Boolean).map((a: any) => a?.name).filter(Boolean).join(', ') || 'Unknown Artist'}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ marginLeft: 12 }}
                            onPress={() => handlePreview(track)}
                            disabled={audioLoading && previewTrackId === track.id}
                          >
                            {audioLoading && previewTrackId === track.id ? (
                              <ActivityIndicator color="#1DB954" size={20} />
                            ) : (
                              <Ionicons name={isPlaying && previewTrackId === track.id ? 'stop-circle' : 'play-circle'} size={28} color="#1DB954" />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ marginLeft: 8, padding: 8 }}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleMorePress(track);
                            }}
                          >
                            <MoreIcon />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Artists */}
                {results.artists && results.artists.items.length > 0 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Artists</Text>
                    {results.artists.items.filter(Boolean).map((artist: any) => {
                      if (!artist || !artist.id) return null;
                      return (
                        <TouchableOpacity
                          key={artist.id}
                          style={styles.browseCardAesthetic}
                          onPress={() => {
                            navigation.navigate('Artist', { id: artist.id, name: artist.name });
                            saveVisitedToHistory({ type: 'artist', id: artist.id, name: artist.name });
                          }}
                        >
                          <Image
                            source={
                              artist?.images && Array.isArray(artist.images) && artist.images[0]?.url
                                ? { uri: artist.images[0].url }
                                : require('../../assets/images/profile_picture.png')
                            }
                            style={[styles.browseImage, { borderRadius: 32 }]}
                          />
                          <View style={styles.browseContent}>
                            <Text style={styles.browseTitle}>{artist?.name || 'Unknown Artist'}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {/* Albums */}
                {results.albums && results.albums.items.length > 0 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Albums</Text>
                    {results.albums.items.filter(Boolean).map((album: any) => {
                      if (!album || !album.id) return null;
                      return (
                        <TouchableOpacity key={album.id} style={styles.browseCardAesthetic}
                          onPress={() => {
                            navigation.navigate('Album', { id: album.id, name: album.name });
                            saveVisitedToHistory({ type: 'album', id: album.id, name: album.name });
                          }}
                        >
                          <Image
                            source={
                              album?.images && Array.isArray(album.images) && album.images[0]?.url
                                ? { uri: album.images[0].url }
                                : require('../../assets/images/profile_picture.png')
                            }
                            style={[styles.browseImage, { borderRadius: 8 }]}
                          />
                          <View style={styles.browseContent}>
                            <Text style={styles.browseTitle}>{album?.name || 'Unknown Album'}</Text>
                            {album.artists && album.artists.length > 0 && (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                onPress={() => {
                                  const firstArtist = album.artists[0];
                                  if (firstArtist && firstArtist.id) {
                                    try {
                                      navigation.navigate('Artist', {
                                        id: firstArtist.id,
                                        name: firstArtist.name || 'Unknown Artist'
                                      });
                                      saveVisitedToHistory({ type: 'artist', id: firstArtist.id, name: firstArtist.name });
                                    } catch (error) { }
                                  }
                                }}
                              >
                                <Text style={[styles.browseArtist, { textDecorationLine: 'underline' }]}>
                                  {album.artists.filter(Boolean).map((a: any) => a?.name).filter(Boolean).join(', ') || 'Unknown Artist'}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {/* Playlists */}
                {results.playlists && results.playlists.items.length > 0 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Playlists</Text>
                    {results.playlists.items.filter(Boolean).map((playlist: any) => {
                      if (!playlist || !playlist.id) return null;
                      return (
                        <TouchableOpacity
                          key={playlist.id}
                          style={styles.browseCardAesthetic}
                          onPress={() => {
                            navigation.navigate('Playlist', { id: playlist.id, name: playlist.name });
                            saveVisitedToHistory({ type: 'playlist', id: playlist.id, name: playlist.name });
                          }}
                        >
                          <Image
                            source={
                              playlist?.images && Array.isArray(playlist.images) && playlist.images[0]?.url
                                ? { uri: playlist.images[0].url }
                                : require('../../assets/images/profile_picture.png')
                            }
                            style={[styles.browseImage, { borderRadius: 8 }]}
                          />
                          <View style={styles.browseContent}>
                            <Text style={styles.browseTitle}>{playlist?.name || 'Unknown Playlist'}</Text>
                            <Text style={styles.browseArtist}>{playlist?.owner?.display_name || 'Unknown Owner'}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            )}

            {/* Picked for you section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Picked for you</Text>

              <TouchableOpacity
                style={styles.pickedCard}
                onPress={() => navigation.navigate('Artist', { id: 'picked-artist', name: 'K-Pop Gaming' })}
              >
                <Image
                  source={require('../../assets/images/picked.png')}
                  style={styles.pickedImage}
                />
                <View style={styles.pickedContent}>
                  <View style={styles.pickedTextContainer}>
                    <Text style={styles.pickedSubtitle}>Playlist</Text>
                    <Text style={styles.pickedTitle}>K-Pop Gaming</Text>
                    <Text style={styles.pickedDescription}>
                      Enjoy fantastic gameplay with k-pop music!
                    </Text>
                  </View>
                  <View style={styles.pickedActions}>
                    <TouchableOpacity style={styles.addButton}>
                      <More />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playButton}>
                      <Ionicons name="play" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Explore your genres section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore your genres</Text>

              <View style={styles.genresGrid}>
                {genres.map((item) => (
                  <GenreTile key={item.id} item={item} />
                ))}
              </View>
            </View>

            {/* Browse all section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse all</Text>

              {/* <TouchableOpacity style={styles.browseCard}>
              <Image
                source={{ uri: 'https://picsum.photos/60/60?random=album' }}
                style={styles.browseImage}
              />
              <View style={styles.browseContent}>
                <Text style={styles.browseTitle}>Paint The Town Red</Text>
                <Text style={styles.browseArtist}>Doja Cat</Text>
              </View>
              <TouchableOpacity style={styles.moreButtonBrowse}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#b3b3b3" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButtonBrowse}>
                <Ionicons name="play" size={16} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity> */}
            </View>
          </ScrollView>

          <NowPlayingBar />

          {/* Playlist Selection Modal */}
          <Modal
            visible={isPlaylistModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsPlaylistModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add to Playlist</Text>
                  <TouchableOpacity onPress={() => setIsPlaylistModalVisible(false)}>
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {isLoadingPlaylists ? (
                  <ActivityIndicator size="large" color="#1DB954" style={styles.loadingIndicator} />
                ) : userPlaylists.length === 0 ? (
                  <Text style={styles.noPlaylistsText}>You don't have any playlists yet.</Text>
                ) : (
                  <FlatList
                    data={userPlaylists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.playlistItem}
                        onPress={() => handleAddToPlaylist(item.id)}
                      >
                        <Image
                          source={item.images?.[0]?.url ? { uri: item.images[0].url } : require('../../assets/images/profile_picture.png')}
                          style={styles.playlistImage}
                        />
                        <View style={styles.playlistInfo}>
                          <Text style={styles.playlistName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.playlistTracks}>
                            {item.tracks?.total || 0} tracks
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  noPlaylistsText: {
    color: '#b3b3b3',
    textAlign: 'center',
    marginVertical: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  playlistTracks: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 80, // Add some bottom margin to account for the now playing bar
  },
  resultsContentContainer: {
    paddingBottom: 100, // Extra padding at the bottom for better scrolling
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickedCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    height: 152,
    flexDirection: 'row',
  },
  pickedImage: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  pickedContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 16,
    flex: 1,
  },
  pickedTextContainer: {
    flex: 1,
  },
  pickedSubtitle: {
    color: '#b3b3b3',
    fontSize: 13,
    marginBottom: 4,
  },
  pickedTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pickedDescription: {
    color: '#b3b3b3',
    fontSize: 10,
    lineHeight: 16,
    marginBottom: 4,
  },
  pickedActions: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  addButton: {},
  playButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genreTile: {
    width: '31%',
    height: 190,
    borderRadius: 10,
    // padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  genreTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 2,
    bottom: 10,
    left: 10,
  },
  genreImage: {
    // position: 'absolute',
    // bottom: -10,
    // right: -10,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    // transform: [{ rotate: '15deg' }],
  },
  browseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  browseImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  browseContent: {
    flex: 1,
  },
  browseTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  browseArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  moreButtonBrowse: {
    marginRight: 12,
  },
  playButtonBrowse: {
    backgroundColor: '#1DB954',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  historyDropdown: {
    backgroundColor: '#181818',
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  historyItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
  },
  searchResultsContainer: {
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  resultsSection: {
    marginBottom: 24,
  },
  browseCardAesthetic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SpotifySearchScreen;