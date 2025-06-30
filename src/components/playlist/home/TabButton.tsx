import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/index.ts';
import { useTheme } from '../../../hooks/useTheme.ts';

interface TabButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, active, onPress }) => {
  const theme = useTheme();
  const backgroundColor = active ? '#1DB954' : '#333';
  const textColor = active ? '#FFFFFF' : '#B3B3B3';

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TabButton;