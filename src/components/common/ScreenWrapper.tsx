import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/index.ts';

interface ScreenWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  noPadding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  edges = ['top', 'right', 'left'],
  noPadding = false,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }, style]} edges={edges}>
      <View style={[styles.content, noPadding ? null : styles.padding]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
  padding: {
    // paddingHorizontal: 16,
  },
});

export default ScreenWrapper;