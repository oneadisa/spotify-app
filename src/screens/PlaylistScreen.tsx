import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { theme } from '../theme/index.ts';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useTheme } from '../hooks/useTheme.ts';

const PlaylistScreen = () => {
  const theme = useTheme();

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <View style={[styles.artwork, { backgroundColor: theme.colors.card }]} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Playlist Name</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Description of the playlist goes here
          </Text>
        </View>
      
      {/* Track list will go here */}
      <View style={styles.trackList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.trackItem}>
            <Text style={[styles.trackNumber, { color: theme.colors.textSecondary }]}>
              {item}
            </Text>
            <View style={styles.trackInfo}>
              <Text style={[styles.trackTitle, { color: theme.colors.text }]}>
                Track {item}
              </Text>
              <Text style={[styles.trackArtist, { color: theme.colors.textSecondary }]}>
                Artist {item}
              </Text>
            </View>
          </View>
        ))}
      </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  trackList: {
    paddingHorizontal: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  trackNumber: {
    width: 24,
    textAlign: 'center',
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default PlaylistScreen;
