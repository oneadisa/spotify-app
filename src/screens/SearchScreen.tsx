import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import NowPlayingBar from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import More from '@/components/icons/more.tsx';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/icons/back.tsx';
import { getTrackPreview, useAudioPlayer, AdvancedAudioService } from '../services/audioService';
import { usePlayback } from '../contexts/PlaybackContext';
import { showToast } from '../utils/toast';

// Import genre images
const cozyImg = require('../../assets/images/searchscreen/genres/cozy.png');
const koreanIndieImg = require('../../assets/images/searchscreen/genres/korean_indie.png');
const healingImg = require('../../assets/images/searchscreen/genres/healing.png');

const SpotifySearchScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { getCurrentUserProfile, search, isLoading, error } = useSpotifyApi();
  const { isAuthenticated, profileImage } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const { isPlaying, isLoading: audioLoading, play, stop } = useAudioPlayer();
  const { previewTrackId } = usePlayback();

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
    <TouchableOpacity style={[styles.genreTile, ]}>
      <Text style={styles.genreTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.genreImage} />
    </TouchableOpacity>
  );

  // Play/stop preview handler
  const handlePreview = async (track: any) => {
    if (previewTrackId === track.id) {
      await stop();
      return;
    }
    try {
      const previewUrl = await getTrackPreview(track.artists?.[0]?.name || '', track.name);
      if (!previewUrl) throw new Error('No preview available');
      await play(previewUrl, {
        id: track.id,
        title: track.name,
        artist: track.artists?.map((a: any) => a?.name).filter(Boolean).join(', '),
        artwork: track.album?.images?.[0]?.url,
      });
    } catch (e: any) {
      Alert.alert('Preview not available', e?.message || 'Preview not available');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <BackButton />
          </TouchableOpacity>
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
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="What do you want to listen to?"
              placeholderTextColor="#666"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
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
          <View style={{ marginBottom: 32 }}>
            {/* Tracks */}
            {results.tracks && results.tracks.items.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Tracks</Text>
                {results.tracks.items.filter(Boolean).map((track: any) => {
                  if (!track || !track.id) return null;
                  return (
                    <View key={track.id} style={styles.browseCard}>
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
                        <Text style={styles.browseArtist}>{track.artists?.filter(Boolean).map((a: any) => a?.name).filter(Boolean).join(', ') || 'Unknown Artist'}</Text>
                      </View>
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
                    </View>
                  );
                })}
              </View>
            )}
            {/* Artists */}
            {results.artists && results.artists.items.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Artists</Text>
                {results.artists.items.filter(Boolean).map((artist: any) => {
                  if (!artist || !artist.id) return null;
                  return (
                    <TouchableOpacity key={artist.id} style={styles.browseCard}>
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
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Albums</Text>
                {results.albums.items.filter(Boolean).map((album: any) => {
                  if (!album || !album.id) return null;
                  return (
                    <TouchableOpacity key={album.id} style={styles.browseCard}>
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
                        <Text style={styles.browseArtist}>{album.artists?.filter(Boolean).map((a: any) => a?.name).filter(Boolean).join(', ') || 'Unknown Artist'}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {/* Playlists */}
            {results.playlists && results.playlists.items.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Playlists</Text>
                {results.playlists.items.filter(Boolean).map((playlist: any) => {
                  if (!playlist || !playlist.id) return null;
                  return (
                    <TouchableOpacity
                      key={playlist.id}
                      style={styles.browseCard}
                      onPress={() => navigation.navigate('Playlist', { id: playlist.id, name: playlist.name })}
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
          </View>
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
                  <More/>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default SpotifySearchScreen;