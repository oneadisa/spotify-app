import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../core/AppText.tsx';
import { theme } from '../../../theme/index.ts';
import { useTheme } from '../../../hooks/useTheme.ts';

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>{title}</AppText>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
});

export default SectionHeader;