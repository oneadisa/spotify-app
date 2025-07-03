import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConnectToTvIcon from '../../icons/connect-to-tv.tsx';
import { useNavigation } from '@react-navigation/native';
import { usePlayback } from '../../../contexts/PlaybackContext';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/types';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';

export const NowPlayingBar: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { track, isPlaying, artwork, play: playSpotify, pause: pauseSpotify, isPreviewPlaying, previewTitle, previewArtist, previewArtwork, previewTrackId, setPreviewState, progress, duration } = usePlayback();
  const { play: playPreview, stop: stopPreview } = require('../../../services/audioService').useAudioPlayer();
  const playbackState = usePlaybackState();

  // Helper to normalize playbackState to a string
  const getPlaybackStateString = (state: any) => {
    if (typeof state === 'string') return state;
    if (typeof state === 'number') {
      // react-native-track-player: 3 = Playing
      if (state === 3) return 'playing';
      if (state === 2) return 'paused';
      if (state === 1) return 'stopped';
      if (state === 0) return 'none';
    }
    if (state && typeof state === 'object' && 'state' in state) return state.state;
    return 'none';
  };

  // Debug logs for both playbackState and isPlaying
  React.useEffect(() => {
    console.log('NowPlayingBar playbackState:', playbackState);
    console.log('NowPlayingBar isPlaying (context):', isPlaying);
  }, [playbackState, isPlaying]);

  const handlePlayPause = async () => {
    if (isPreviewPlaying && previewTrackId) {
      // If preview is playing, toggle preview using real playback state
      if (playbackStateString === 'playing') {
        await TrackPlayer.pause();
      } else if (playbackStateString === 'paused') {
        await TrackPlayer.play();
      } else if (playbackStateString === 'stopped') {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      } else {
        // If preview is finished or not playing, restart it
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      }
    } else {
      // Main playback
      if (isPlaying) {
        await pauseSpotify();
      } else {
        // Only restart if song is finished
        if (progress >= duration - 1000 && duration > 0) {
          await playSpotify(); // playSpotify will restart the song
        } else {
          await playSpotify(); // playSpotify will resume
        }
      }
    }
  };

  const handleNavigate = () => {
    try {
      console.log('NowPlayingBar: Attempting to navigate to PlayerScreen');
      navigation.navigate('PlayerScreen' as any);
      console.log('NowPlayingBar: Navigation call completed');
    } catch (error) {
      console.error('NowPlayingBar: Navigation error', error);
    }
  };

  const displayArtwork = isPreviewPlaying ? previewArtwork : artwork;
  const displayTitle = isPreviewPlaying ? previewTitle : track?.name;
  const displayArtist = isPreviewPlaying ? previewArtist : (track?.artists?.map((a: any) => a?.name).filter(Boolean).join(', ') || '');
  // Hybrid logic for play/pause icon
  const playbackStateString = getPlaybackStateString(playbackState);
  const showPause = isPreviewPlaying && previewTrackId
    ? playbackStateString === 'playing'
    : isPlaying;

  return (
    <TouchableOpacity onPress={handleNavigate} activeOpacity={0.9}>
      <View style={styles.container}>
        {/* Artwork or music icon */}
        {displayArtwork ? (
          <Image
            source={{ uri: displayArtwork }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#282828' }]}> 
            <Ionicons name="musical-notes" size={28} color="#b3b3b3" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle || 'No song playing'}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {displayArtist}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <ConnectToTvIcon />
        </View>
        <TouchableOpacity onPress={handlePlayPause} style={{ marginLeft: 20 }}>
          <Ionicons
            name={showPause ? 'pause' : 'play'}
            size={25}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#51323C',
    borderTopWidth: 1,
    height: 58,
    borderTopColor: '#282828',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 11,
  },
  icon: {
    marginLeft: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default NowPlayingBar;
