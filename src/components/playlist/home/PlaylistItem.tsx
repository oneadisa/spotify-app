import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../../core/AppText.tsx';
import { useTheme } from '../../../theme/ThemeProvider';
import PlayButton from './PlayButton.tsx';

const PlaylistItem: React.FC<{
  title: string;
  subtitle?: string;
  imageUrl: string | number;
  onPress?: () => void;
  isFeatured?: boolean;
}> = ({ title, subtitle, imageUrl, onPress, isFeatured = false }) => {
  const theme = useTheme();
  const width = isFeatured ? 327 : 160;
  const height = isFeatured ? 180 : 160;

  return (
    <TouchableOpacity style={[styles.container, { width, height, backgroundColor: theme.colors.card }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.image} resizeMode="cover" />
        {isFeatured && <PlayButton />}
      </View>
      <View style={styles.textContainer}>
        <AppText numberOfLines={1} weight="bold" style={styles.title}>{title}</AppText>
        {subtitle && <AppText numberOfLines={1} style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</AppText>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    // height set dynamically via inline styles
    backgroundColor: '#282828',
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#B3B3B3',
  },
});

export default PlaylistItem;