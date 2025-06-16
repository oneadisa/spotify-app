import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConnectToTv from '../icons/connect-to-tv.tsx';

interface NowPlayingBarProps {
  cover: string;
  title: string;
  artist: string;
  onPlayPress?: () => void;
  onDevicesPress?: () => void;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  cover = require('../../../assets/images/now_playing.png'),
  title = 'Paint The Town Red',
  artist = 'Doja Cat',
  onPlayPress = () => {},
  onDevicesPress = () => {},
}) => {
  return (
    <View style={styles.container}>
      <Image source={cover} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>
      <ConnectToTv/>
      <Ionicons 
        name="play" 
        size={25} 
        color="white" 
        onPress={onPlayPress}
        style={[styles.icon, { marginLeft: 20 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    marginHorizontal: 8,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#51323C',
    borderTopWidth: 1,
    height: 58,
    borderTopColor: '#282828',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 11,
  },
  icon: {
    padding: 8,
  },
});

export default NowPlayingBar;
