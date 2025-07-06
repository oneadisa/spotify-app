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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    padding: {
      // paddingHorizontal: 16,
    },
  });

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <View style={[styles.content, noPadding ? null : styles.padding]}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;