import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useIsFocused } from '@react-navigation/native';
import { usePlayback } from '../contexts/PlaybackContext';

const { height } = Dimensions.get('window');

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerScreen = () => {
  const theme = useTheme();
  const { track, isPlaying, progress, duration, artwork, play, pause, next, previous, isLoading } = usePlayback();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.container}>
        <View style={styles.artworkContainer}>
          {artwork ? (
            <Image source={{ uri: artwork }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, { backgroundColor: theme.colors.card }]} />
          )}
        </View>
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {track?.name || 'No song playing'}
          </Text>
          <Text style={[styles.artistName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {track?.artists?.map((a: any) => a?.name).filter(Boolean).join(', ') || ''}
          </Text>
        </View>
        {/* Progress bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 32, marginBottom: 16 }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, width: 40 }}>
            {formatTime(progress)}
          </Text>
          <View style={{ flex: 1, height: 4, backgroundColor: '#333', borderRadius: 2, marginHorizontal: 8 }}>
            <View
              style={{
                width: duration ? `${(progress / duration) * 100}%` : '0%',
                height: 4,
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
              }}
            />
          </View>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, width: 40, textAlign: 'right' }}>
            {formatTime(duration)}
          </Text>
        </View>
        {/* Controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={previous} style={{ marginHorizontal: 24 }}>
            <Ionicons name="play-skip-back" size={36} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} style={{ marginHorizontal: 24 }}>
            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={64} color={theme.colors.primary} />
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

export default PlayerScreen;
