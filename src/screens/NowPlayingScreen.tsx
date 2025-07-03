import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useIsFocused } from '@react-navigation/native';
import { usePlayback } from '../contexts/PlaybackContext';
import TrackPlayer, { useProgress, State, usePlaybackState } from 'react-native-track-player';
import { useAudioPlayer } from '../services/audioService';
import { seekTo } from 'react-native-track-player/lib/src/trackPlayer';

const { height } = Dimensions.get('window');

const formatTime = (msOrSec: number) => {
  if (msOrSec > 1000) {
    // ms
    const totalSeconds = Math.floor(msOrSec / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  } else {
    // sec
    const minutes = Math.floor(msOrSec / 60);
    const seconds = Math.floor(msOrSec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
};

const NowPlayingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    track,
    isPlaying,
    progress,
    duration,
    artwork,
    play,
    pause,
    next,
    previous,
    isLoading,
    isPreviewPlaying,
    previewTitle,
    previewArtist,
    previewArtwork,
    previewTrackId,
    previewArtistId,
  } = usePlayback();
  const { position, duration: previewDuration } = useProgress(200);
  const playbackState = usePlaybackState();
  const { isPlaying: isPreviewActuallyPlaying, play: playPreview, stop: stopPreview } = useAudioPlayer();

  useEffect(() => {
    console.log('NowPlayingScreen: mounted, track:', track);
  }, [track]);

  // Use preview info if preview is playing, otherwise use main track
  const displayArtwork = isPreviewPlaying ? previewArtwork : artwork;
  const displayTitle = isPreviewPlaying ? previewTitle : track?.name;
  const displayArtist = isPreviewPlaying ? previewArtist : (track?.artists?.map((a: any) => a?.name).filter(Boolean).join(', ') || '');
  
  // Extract artist ID for navigation (for both main track and preview)
  const artistId = isPreviewPlaying ? previewArtistId : track?.artists?.[0]?.id;
  const artistName = isPreviewPlaying ? previewArtist : track?.artists?.[0]?.name;
  
  // Convert all times to milliseconds for consistent handling
  const displayProgress = isPreviewPlaying ? position * 1000 : progress; // Convert seconds to ms for preview
  const displayDuration = isPreviewPlaying ? (previewDuration * 1000) : duration; // Convert seconds to ms for preview
  
  // Ensure we have valid values for the progress bar
  const progressPercentage = displayDuration > 0 
    ? Math.min(100, Math.max(0, (displayProgress / displayDuration) * 100))
    : 0;

  const handlePlayPause = async () => {
    if (isPreviewPlaying) {
      // Handle preview playback
      if (isPreviewActuallyPlaying) {
        await TrackPlayer.pause();
      } else {
        // If preview is finished, restart it
        if (position >= previewDuration - 1) {
          await TrackPlayer.seekTo(0);
        }
        await TrackPlayer.play();
      }
    } else {
      // Handle regular track playback
      if (isPlaying) {
        await pause();
      } else {
        // If track is at or near the end, or not currently playing, restart it
        if (!isPlaying || progress >= duration - 1000 || progress === 0) {
          await seekTo(0);
        }
        await play();
      }
    }
  };

  const handleArtistPress = () => {
    if (artistId && artistName) {
      (navigation as any).navigate('Artist', { id: artistId, name: artistName });
    }
  };

  if (!displayTitle) {
    return (
      <ScreenWrapper edges={['top']}>
        <View style={styles.container}>
          <Text style={{ color: theme.colors.text, fontSize: 18, textAlign: 'center', marginTop: 40 }}>
            No song is currently playing.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.container}>
        <View style={styles.artworkContainer}>
          {displayArtwork ? (
            <Image source={{ uri: displayArtwork }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, { backgroundColor: theme.colors.card }]} />
          )}
        </View>
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {displayTitle || 'No song playing'}
          </Text>
          <TouchableOpacity onPress={handleArtistPress} activeOpacity={0.7} disabled={!artistId}>
            <Text style={[styles.artistName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {displayArtist}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Progress bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 32, marginBottom: 16 }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, width: 40 }}>
            {formatTime(displayProgress)}
          </Text>
          <View style={{ flex: 1, height: 4, backgroundColor: '#333', borderRadius: 2, marginHorizontal: 8 }}>
            <View
              style={{
                width: `${progressPercentage}%`,
                height: 4,
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
              }}
            />
          </View>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, width: 40, textAlign: 'right' }}>
            {formatTime(displayDuration)}
          </Text>
        </View>
        {/* Controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={previous} style={{ marginHorizontal: 24 }}>
            <Ionicons name="play-skip-back" size={36} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} style={{ marginHorizontal: 24 }}>
            <Ionicons 
              name={
                isPreviewPlaying
                  ? (isPreviewActuallyPlaying ? 'pause-circle' : 'play-circle')
                  : (isPlaying ? 'pause-circle' : 'play-circle')
              } 
              size={64} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={next} style={{ marginHorizontal: 24 }}>
            <Ionicons name="play-skip-forward" size={36} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  artwork: {
    width: height * 0.4,
    height: height * 0.4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
  },
});

export default NowPlayingScreen; 