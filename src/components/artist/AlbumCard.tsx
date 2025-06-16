import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/index.ts';

interface AlbumCardProps {
  title: string;
  year: string;
  type: 'Album' | 'Single' | 'Compilation';
  imageUrl?: string;
  onPress?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  title,
  year,
  type,
  imageUrl,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.card }]}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderIcon}>
            <Text style={styles.placeholderText}>🎵</Text>
          </View>
        )}
      </View>
      
      <Text 
        style={[styles.title, { color: theme.colors.text }]} 
        numberOfLines={1}
      >
        {title}
      </Text>
      
      <View style={styles.details}>
        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
          {year} • {type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CARD_WIDTH = (Dimensions.get('window').width - 64) / 2; // 16 + 16 + 16 (padding) + 16 (gap) / 2 columns

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default AlbumCard;
