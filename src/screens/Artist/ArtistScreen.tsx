import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Liked } from '../../components/icons/liked.tsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BackButton from '@/components/icons/back.tsx';
import { NowPlayingBar } from '../../components/NowPlayingBar/NowPlayingBar.tsx';
import More from '@/components/icons/more.tsx';
import Shuffle from '@/components/icons/shuffle.tsx';

// Import local images
const blackpinkImage = require('../../../assets/images/artistscreen/background/blackpink_background.png');
const bornPinkCover = require('../../../assets/images/artistscreen/songs/born_pink.png');
const crownCover = require('../../../assets/images/artistscreen/songs/crown.png');

// Get image dimensions
const COVER_IMAGE_HEIGHT = 322;
const SONG_IMAGE_SIZE = 50;
const NOW_PLAYING_IMAGE_SIZE = 40;

const BLACKPINK = {
  name: 'BLACKPINK',
  monthlyListeners: '19.4M monthly listeners',
  image: blackpinkImage,
  popularSongs: [
    {
      title: 'How You Like That',
      plays: '933,744,935',
      cover: crownCover,
    },
    {
      title: 'Shut Down',
      plays: '585,571,655',
      cover: bornPinkCover,
    },
    {
      title: 'Pink Venom',
      plays: '649,963,189',
      cover: bornPinkCover,
    },
  ],
  currentSong: {
    title: 'Paint The Town Red',
    artist: 'Doja Cat',
    cover: blackpinkImage,
  },
};

const BlackpinkProfile = () => {
  const navigation = useNavigation();
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.coverImageContainer}>
          <Image 
            source={BLACKPINK.image} 
            style={[
              styles.coverImage, 
              { height: COVER_IMAGE_HEIGHT, resizeMode: 'cover' }
            ]} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.25)']}
            style={styles.imageOverlay}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.artistNameContainer}>
            <Text style={styles.artistName}>BLACKPINK</Text>
          </View>
        </View>
        <LinearGradient
          colors={['#371A1A', '#111111']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBelowImage}
        />
        <View style={{paddingHorizontal: 16}}>
        <Text style={styles.listeners}>{BLACKPINK.monthlyListeners}</Text>

        <View style={styles.topRowContainer}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
            <View style={styles.moreButton}>
              <More/>
            </View>
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.shuffleButton}>
              <Shuffle/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="play" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.youLikedRow}>
          <View style={styles.likedContainer}>
            <Image
              source={require('../../../assets/images/artistscreen/blackpink.png')}
              style={styles.artistImage}
            />
            <View style={styles.likedIcon}>
              <Liked width={22} height={22} />
            </View>
          </View>
          <View style={styles.youLikedTextContainer}>
            <Text style={styles.youLikedText}>You liked</Text>
            <Text style={styles.songCount}>1 song • BLACKPINK</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular</Text>

        {BLACKPINK.popularSongs.map((song, index) => (
          <View key={index} style={styles.songRow}>
            <Text style={styles.songIndex}>{index + 1}</Text>
            <Image 
              source={song.cover} 
              style={[
                styles.songCover, 
                { 
                  width: SONG_IMAGE_SIZE, 
                  height: SONG_IMAGE_SIZE,
                  borderRadius: 4
                }
              ]} 
            />
            <View>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songPlays}>{song.plays}</Text>
            </View>
           <More style={{ marginLeft: 'auto' }} />
          </View>
        ))}
        </View>
      </ScrollView>

      <NowPlayingBar 
        cover={BLACKPINK.currentSong.cover}
        title={BLACKPINK.currentSong.title}
        artist={BLACKPINK.currentSong.artist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 0,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    // paddingHorizontal: 16,
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    // marginBottom: 16,
  },
  coverImage: {
    width: '100%',
  },
  gradientBelowImage: {
    width: '100%',
    height: 80, // Adjust this value to control the height of the gradient
    position: 'absolute',
    top: 322, // Match this with COVER_IMAGE_HEIGHT
    left: 0,
    right: 0,
    zIndex: -1,
    opacity: 0.6,
  },
  artistName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 2,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  artistNameContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  listeners: {
    fontSize: 14,
    color: 'lightgray',
    marginTop: 10,
  },
  followBtn: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  followText: {
    color: 'white',
    fontSize: 14,
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginLeft: 16,
  },
  shuffleButton: {
    marginRight: 16,
  },
  youLikedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  likedContainer: {
    position: 'relative',
    marginRight: 10,
  },
  youLikedTextContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  artistImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  likedIcon: {
    position: 'absolute',
    bottom: -5,
    right: -4,
    backgroundColor: 'black',
    borderRadius: 13,
    padding: 1,
  },
  youLikedText: {
    color: 'white',
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
  },
  songCount: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  playBtn: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 24,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  songIndex: {
    color: 'white',
    width: 20,
  },
  songCover: {
    marginHorizontal: 12,
  },
  songTitle: {
    color: 'white',
    fontSize: 14,
  },
  songPlays: {
    color: 'gray',
    fontSize: 12,
  },
  bottomNowPlaying: {
    backgroundColor: '#3b2e2e',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.2,
    borderColor: '#555',
  },
  nowPlayingImage: {
    width: NOW_PLAYING_IMAGE_SIZE,
    height: NOW_PLAYING_IMAGE_SIZE,
    borderRadius: 4,
    marginRight: 12,
  },
  nowPlayingTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  nowPlayingArtist: {
    color: 'gray',
    fontSize: 12,
  },
});

export default BlackpinkProfile;
