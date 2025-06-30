import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { theme } from '../../theme/index.ts';
import ScreenWrapper from '../../components/common/ScreenWrapper.tsx';
import { useTheme } from '../../hooks/useTheme.ts';

const { height } = Dimensions.get('window');

const PlayerScreen = () => {
  const theme = useTheme();

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.container}>
        <View style={styles.artworkContainer}>
          {/* Album artwork will go here */}
          <View style={[styles.artwork, { backgroundColor: theme.colors.card }]} />
        </View>
        
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: theme.colors.text }]}>
            Song Title
          </Text>
          <Text style={[styles.artistName, { color: theme.colors.textSecondary }]}>
            Artist Name
          </Text>
        </View>

        {/* Player controls will go here */}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  artwork: {
    width: height * 0.4,
    height: height * 0.4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
  },
});

export default PlayerScreen;
