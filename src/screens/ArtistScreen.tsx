import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Liked } from '../components/icons/liked.tsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import BackButton from '../components/icons/back.tsx';
import { NowPlayingBar } from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import More from '../components/icons/more.tsx';
import Shuffle from '../components/icons/shuffle.tsx';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';

// Import local images for fallback
const defaultArtistImage = require('../../assets/images/profile_picture.png');

// Get image dimensions
const COVER_IMAGE_HEIGHT = 322;
const SONG_IMAGE_SIZE = 50;
const NOW_PLAYING_IMAGE_SIZE = 40;

type ArtistScreenRouteProp = RouteProp<RootStackParamList, 'Artist'>;

interface ArtistData {
  id: string;
  name: string;
  images?: Array<{ url: string; width?: number; height?: number }>;
  followers?: { total: number };
  genres?: string[];
  popularity?: number;
}

interface Track {
  id: string;
  name: string;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

const ArtistScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ArtistScreenRouteProp>();
  const { id, name } = route.params;
  
  console.log('ArtistScreen: Received params - id:', id, 'name:', name);
  
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  
  const { getArtist, getArtistTopTracks, getUserPlaylists, addTracksToPlaylist, startPlayback } = useSpotifyApi();

  // Add preview playback for artist tracks (like SearchScreen)
  const { isPlaying, isLoading: audioLoading, play, stop } = require('../services/audioService').useAudioPlayer();
  const { previewTrackId } = require('../contexts/PlaybackContext').usePlayback();

  // Sequential preview playback for all tracks
  const [isSequentialPlaying, setIsSequentialPlaying] = useState(false);
  const [sequentialIndex, setSequentialIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch artist details
        const artistData = await getArtist(id);
        if (artistData) {
          setArtist(artistData);
        }
        
        // Fetch top tracks
        const tracksData = await getArtistTopTracks(id);
        if (tracksData && tracksData.tracks) {
          setTopTracks(tracksData.tracks);
        }
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError('Failed to load artist data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArtistData();
    }
  }, [id, getArtist, getArtistTopTracks]);
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M monthly listeners`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K monthly listeners`;
    }
    return `${count} monthly listeners`;
  };

  const getArtistImage = () => {
    if (artist?.images && artist.images.length > 0) {
      return { uri: artist.images[0].url };
    }
    return defaultArtistImage;
  };

  const handleMorePress = async (track: Track) => {
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

  // Helper to get all playable previews
  const getPlayablePreviews = async () => {
    const playableTracks: (Track & { preview_url: string })[] = [];
    for (const track of topTracks) {
      let previewUrl = (track as any).preview_url;
      if (!previewUrl) {
        const artistName = Array.isArray((track as any).artists) && (track as any).artists.length > 0
          ? (track as any).artists[0]?.name
          : '';
        previewUrl = await require('../services/audioService').getTrackPreview(artistName, track.name);
      }
      if (previewUrl) {
        playableTracks.push({ ...track, preview_url: previewUrl });
      }
    }
    return playableTracks;
  };

  const playAllPreviewsSequentially = async () => {
    if (!topTracks || topTracks.length === 0) return;
    const playableTracks = await getPlayablePreviews();
    if (playableTracks.length === 0) {
      Alert.alert('No previews available for this artist.');
      setIsSequentialPlaying(false);
      setSequentialIndex(null);
      return;
    }
    setIsSequentialPlaying(true);
    setSequentialIndex(0);
    // Play the first preview
    const track = playableTracks[0];
    try {
      await play(track.preview_url, {
        id: track.id,
        title: track.name,
        artist: Array.isArray((track as any).artists)
          ? (track as any).artists.map((a: any) => a?.name).filter(Boolean).join(', ')
          : '',
        artwork: track.album?.images?.[0]?.url,
        artistId: Array.isArray((track as any).artists) ? (track as any).artists[0]?.id || null : null,
      });
    } catch (e) {}
  };

  // Listen for playback end and play next preview
  useEffect(() => {
    if (!isSequentialPlaying || sequentialIndex === null) return;
    let cancelled = false;
    const next = async () => {
      const playableTracks = await getPlayablePreviews();
      if (!isSequentialPlaying || sequentialIndex === null || sequentialIndex >= playableTracks.length) {
        setIsSequentialPlaying(false);
        setSequentialIndex(null);
        return;
      }
      // Listen for playback end
      const onPlaybackEnd = async () => {
        if (cancelled) return;
        const nextIndex = sequentialIndex + 1;
        if (nextIndex < playableTracks.length) {
          setSequentialIndex(nextIndex);
          const nextTrack = playableTracks[nextIndex];
          try {
            await play(nextTrack.preview_url, {
              id: nextTrack.id,
              title: nextTrack.name,
              artist: Array.isArray((nextTrack as any).artists)
                ? (nextTrack as any).artists.map((a: any) => a?.name).filter(Boolean).join(', ')
                : '',
              artwork: nextTrack.album?.images?.[0]?.url,
              artistId: Array.isArray((nextTrack as any).artists) ? (nextTrack as any).artists[0]?.id || null : null,
            });
          } catch (e) {}
        } else {
          setIsSequentialPlaying(false);
          setSequentialIndex(null);
        }
      };
      // Use a timer for 30s or until playback stops
      const timer = setTimeout(onPlaybackEnd, 30000);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    };
    let cleanupFn: (() => void) | undefined;
    next().then(fn => { cleanupFn = fn; });
    return () => { if (typeof cleanupFn === 'function') cleanupFn(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSequentialPlaying, sequentialIndex]);

  // Stop sequential playback if user triggers any preview or leaves screen
  useEffect(() => {
    return () => {
      setIsSequentialPlaying(false);
      setSequentialIndex(null);
    };
  }, []);

  // Add preview playback for artist tracks (like SearchScreen)
  const handlePreview = async (track: Track) => {
    if (!track || !track.id) return;
    // If this track is currently previewing, stop it
    if (isPlaying && previewTrackId === track.id) {
      await stop();
      return;
    }
    // Use preview_url if available, else fallback
    let previewUrl = (track as any).preview_url;
    if (!previewUrl) {
      // Try to fetch preview from Deezer as fallback
      const artistName = Array.isArray((track as any).artists) && (track as any).artists.length > 0
        ? (track as any).artists[0]?.name
        : '';
      previewUrl = await require('../services/audioService').getTrackPreview(artistName, track.name);
    }
    if (!previewUrl) {
      Alert.alert('No preview available for this track.');
      return;
    }
    try {
      const artists = Array.isArray((track as any).artists)
        ? (track as any).artists.map((a: any) => a?.name).filter(Boolean).join(', ')
        : '';
      await play(previewUrl, {
        id: track.id,
        title: track.name,
        artist: artists,
        artwork: track.album?.images?.[0]?.url,
        artistId: Array.isArray((track as any).artists) ? (track as any).artists[0]?.id || null : null,
      });
    } catch (e: any) {
      Alert.alert('Failed to play preview', e?.message || 'Failed to play preview');
      console.error('Preview error:', e);
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: theme.colors.background,
    paddingTop: 0,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    // paddingHorizontal: 16,
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    // marginBottom: 16,
  },
  coverImage: {
    width: '100%',
  },
  gradientBelowImage: {
    width: '100%',
    height: 80, // Adjust this value to control the height of the gradient
    position: 'absolute',
    top: 322, // Match this with COVER_IMAGE_HEIGHT
    left: 0,
    right: 0,
    zIndex: -1,
    opacity: 0.6,
  },
  artistName: {
    fontSize: 48,
    fontWeight: 'bold',
      color: theme.colors.text,
    zIndex: 2,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  artistNameContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  listeners: {
    fontSize: 14,
      color: theme.colors.textSecondary,
    marginTop: 10,
  },
  followBtn: {
      borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  followText: {
      color: theme.colors.text,
    fontSize: 14,
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginLeft: 16,
  },
  shuffleButton: {
    marginRight: 16,
  },
  youLikedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  likedContainer: {
    position: 'relative',
    marginRight: 10,
  },
  youLikedTextContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  artistImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  likedIcon: {
    position: 'absolute',
    bottom: -5,
    right: -4,
      backgroundColor: theme.colors.background,
    borderRadius: 13,
    padding: 1,
  },
  youLikedText: {
      color: theme.colors.text,
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
  },
  songCount: {
      color: theme.colors.text,
    fontSize: 12,
    marginTop: 2,
  },
  playBtn: {
      backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
      color: theme.colors.text,
    fontWeight: 'bold',
    marginTop: 24,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  songIndex: {
      color: theme.colors.text,
    width: 20,
  },
  songCover: {
    marginHorizontal: 12,
  },
  songTitle: {
      color: theme.colors.text,
    fontSize: 14,
  },
  songPlays: {
      color: theme.colors.textSecondary,
    fontSize: 12,
  },
  bottomNowPlaying: {
      backgroundColor: theme.colors.card,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.2,
      borderColor: theme.colors.border,
  },
  nowPlayingImage: {
    width: NOW_PLAYING_IMAGE_SIZE,
    height: NOW_PLAYING_IMAGE_SIZE,
    borderRadius: 4,
    marginRight: 12,
  },
  nowPlayingTitle: {
      color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  nowPlayingArtist: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      fontSize: 16,
      marginTop: 10,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 20,
    },
    retryButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    songInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
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
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingIndicator: {
      marginVertical: 40,
    },
    noPlaylistsText: {
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: 20,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
      color: theme.colors.text,
      fontSize: 16,
      marginBottom: 4,
    },
    playlistTracks: {
      color: theme.colors.textSecondary,
    fontSize: 12,
  },
});

  // Move all header content (cover image, artist info, etc.) into a header component
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
      </View>
      <View style={styles.coverImageContainer}>
        <Image 
          source={getArtistImage()} 
          style={[
            styles.coverImage, 
            { height: COVER_IMAGE_HEIGHT, resizeMode: 'cover' }
          ]} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.25)']}
          style={styles.imageOverlay}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.artistNameContainer}>
          <Text style={styles.artistName}>{artist?.name}</Text>
        </View>
      </View>
      <LinearGradient
        colors={[theme.colors.card, theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBelowImage}
      />
      <View style={{paddingHorizontal: 16}}>
        <Text style={styles.listeners}>
          {artist?.followers ? formatFollowers(artist.followers.total) : 'Monthly listeners unavailable'}
        </Text>
        <View style={styles.topRowContainer}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
            <View style={styles.moreButton}>
              <More/>
            </View>
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.shuffleButton}>
              <Shuffle/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playBtn} onPress={playAllPreviewsSequentially} disabled={isSequentialPlaying}>
              <Ionicons name="play" size={24} color={theme.colors.buttonText} />
            </TouchableOpacity>
          </View>
        </View>
        {topTracks.length > 0 && (
          <Text style={styles.sectionTitle}>Popular</Text>
        )}
      </View>
    </>
  );

  // Move NowPlayingBar and Modal to footer
  const renderFooter = () => (
    <>
      {/* <NowPlayingBar /> */}
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
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            {isLoadingPlaylists ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
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
                      source={item.images?.[0]?.url ? { uri: item.images[0].url } : defaultArtistImage}
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
    </>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading artist...</Text>
      </View>
    );
  }

  if (error || !artist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Artist not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTrackItem = ({ item: track }: { item: Track }) => (
    <TouchableOpacity 
      style={styles.songRow}
      onPress={() => handlePreview(track)}
      activeOpacity={0.8}
    >
      <Image 
        source={
          track.album?.images && track.album.images.length > 0
            ? { uri: track.album.images[0].url }
            : defaultArtistImage
        } 
        style={[
          styles.songCover, 
          { 
            width: SONG_IMAGE_SIZE, 
            height: SONG_IMAGE_SIZE,
            borderRadius: 4
          }
        ]} 
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{track.name}</Text>
        <Text style={styles.songPlays}>Track</Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleMorePress(track)}
        style={{ marginLeft: 'auto', padding: 10 }}
      >
        <More />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={topTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <NowPlayingBar />
      </View>
    </View>
  );
};

export default ArtistScreen;
