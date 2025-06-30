import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { theme } from '../../../theme/index.ts';
import { useTheme } from '../../../hooks/useTheme.ts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2; // 16 + 16 + 24 (padding + gap) / 2 columns

interface CategoryCardProps {
  title: string;
  color: string;
  image?: any;
  onPress?: () => void;
  isLarge?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, color, image, onPress, isLarge = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: color }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      {image && (
        <Image 
          source={image} 
          style={[
            styles.image, 
            isLarge && styles.largeImage
          ]} 
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 6,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    maxWidth: '80%',
  },
  image: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: -16,
    bottom: -16,
    transform: [{ rotate: '25deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  largeImage: {
    width: 120,
    height: 120,
    right: -20,
    bottom: -20,
  },
});

export default CategoryCard;
