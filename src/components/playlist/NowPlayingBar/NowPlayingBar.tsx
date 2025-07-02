import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConnectToTvIcon from '../../icons/connect-to-tv.tsx';
import { useNavigation } from '@react-navigation/native';
import { usePlayback } from '../../../contexts/PlaybackContext';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/types';

export const NowPlayingBar: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { track, isPlaying, artwork, play: playSpotify, pause: pauseSpotify, isPreviewPlaying, previewTitle, previewArtist, previewArtwork, previewTrackId, setPreviewState } = usePlayback();
  const { play: playPreview, stop: stopPreview } = require('../../../services/audioService').useAudioPlayer();

  const handlePlayPause = () => {
    if (isPreviewPlaying && previewTrackId) {
      stopPreview();
      setPreviewState({ isPreviewPlaying: false, previewTrackId: null });
    } else if (isPlaying) {
      pauseSpotify();
    } else {
      playSpotify();
    }
  };

  const displayArtwork = isPreviewPlaying ? previewArtwork : artwork;
  const displayTitle = isPreviewPlaying ? previewTitle : track?.name;
  const displayArtist = isPreviewPlaying ? previewArtist : (track?.artists?.map((a: any) => a?.name).filter(Boolean).join(', ') || '');

  return (
    <TouchableOpacity onPress={() => navigation.navigate('PlayerScreen' as any)} activeOpacity={0.9}>
      <View style={styles.container}>
        <Image
          source={displayArtwork ? { uri: displayArtwork } : require('../../../../assets/images/now_playing.png')}
          style={styles.image}
        />
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
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={25}
          color="white"
          onPress={e => {
            e.stopPropagation();
            handlePlayPause();
          }}
          style={[styles.icon, { marginLeft: 20 }]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
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
