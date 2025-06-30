import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { theme } from '../theme/index.ts';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useTheme } from '../hooks/useTheme.ts';

const { height } = Dimensions.get('window');

const LibraryScreen = () => {
  const theme = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Your Library
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Library Empty for now</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Adjust this value to center the text vertically
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LibraryScreen;
