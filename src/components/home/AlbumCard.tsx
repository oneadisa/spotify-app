import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CARD_SIZE = 160;
import AppText from '../core/AppText.tsx';
import { useTheme } from '../../theme/index.ts';

const AlbumCard: React.FC<{
  title: string;
  subtitle?: string;
  imageUrl: string | number;
  onPress?: () => void;
  isHorizontal?: boolean;
}> = ({ title, subtitle, imageUrl, onPress, isHorizontal = false }) => {
  const theme = useTheme();
  const cardWidth = isHorizontal ? CARD_SIZE : CARD_SIZE;
  const height = isHorizontal ? 60 : CARD_SIZE;

  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth, height, backgroundColor: theme.colors.card }]} onPress={onPress} activeOpacity={0.8}>
      <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={[styles.image, { height: isHorizontal ? 60 : CARD_SIZE }]} resizeMode="cover" />
      <View style={styles.textContainer}>
        <AppText numberOfLines={1} weight="bold" style={styles.title}>{title}</AppText>
        {subtitle && <AppText numberOfLines={1} style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</AppText>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 16,
    marginBottom: 16,
    backgroundColor: '#181818',
  },
  image: {
    width: '100%',
    // height set dynamically
    backgroundColor: '#333',
  },
  textContainer: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
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

export default AlbumCard;