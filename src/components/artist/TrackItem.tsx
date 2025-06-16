import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/index.ts';

interface TrackItemProps {
  title: string;
  artist: string;
  duration: string;
  isPlaying?: boolean;
  onPress?: () => void;
  onMorePress?: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  title,
  artist,
  duration,
  isPlaying = false,
  onPress,
  onMorePress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.trackInfo}>
        {isPlaying ? (
          <Ionicons name="pause" size={20} color={theme.colors.primary} style={styles.icon} />
        ) : (
          <Text style={[styles.trackNumber, { color: theme.colors.textSecondary }]}>
            {duration}
          </Text>
        )}
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title, 
              { color: isPlaying ? theme.colors.primary : theme.colors.text }
            ]} 
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text 
            style={[styles.artist, { color: theme.colors.textSecondary }]} 
            numberOfLines={1}
          >
            {artist}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={onMorePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  trackNumber: {
    width: 40,
    fontSize: 14,
    textAlign: 'right',
    marginRight: 12,
  },
  icon: {
    width: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default TrackItem;
