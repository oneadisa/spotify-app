import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NowPlayingBar } from '../../components/NowPlayingBar/NowPlayingBar.tsx';
import Add from '@/components/icons/add.tsx';

// Import images
const justHitsImg = require('../../../assets/images/homescreen/musictiles/just_hits.png');
const christmasVibesImg = require('../../../assets/images/homescreen/musictiles/christmas_vibes.png');
const onRepeatImg = require('../../../assets/images/homescreen/musictiles/on_repeat.png');
const dailyMix1Img = require('../../../assets/images/homescreen/musictiles/daily_mix_1.png');
const baddieImg = require('../../../assets/images/homescreen/musictiles/baddie.png');
const arianaGrandeRadioImg = require('../../../assets/images/homescreen/musictiles/ariana_grande_radio.png');
const kpopGamingImg = require('../../../assets/images/homescreen/musictiles/k-pop_gaming.png');
const missedHitsImg = require('../../../assets/images/homescreen/musictiles/missed_hits.png');

type MusicTileItem = {
  id: number;
  title: string;
  image: any; // Using 'any' for require() return type
  backgroundColor: string;
  hasRepeatIcon?: boolean;
  isMissedHits?: boolean;
};

const MusicApp = () => {
  const categories = [
    { id: 1, title: 'All', active: true },
    { id: 2, title: 'Music', active: false },
    { id: 3, title: 'Podcasts', active: false },
    { id: 4, title: 'Wrapped', active: false, outlined: true },
  ];

  const musicTiles: MusicTileItem[] = [
    {
      id: 1,
      title: 'just hits',
      image: justHitsImg,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 2,
      title: 'Christmas Vibes 2023 🎄',
      image: christmasVibesImg,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 3,
      title: 'On Repeat',
      image: onRepeatImg,
      backgroundColor: '#2a2a2a',
      hasRepeatIcon: true,
    },
    {
      id: 4,
      title: 'Daily Mix 1',
      image: dailyMix1Img,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 5,
      title: 'baddie.',
      image: baddieImg,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 6,
      title: 'Ariana Grande Radio',
      image: arianaGrandeRadioImg,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 7,
      title: 'K-Pop Gaming',
      image: kpopGamingImg,
      backgroundColor: '#2a2a2a',
    },
    {
      id: 8,
      title: 'Missed Hits',
      image: missedHitsImg,
      backgroundColor: '#2a2a2a',
      // isMissedHits: true,
    },
  ];

  const CategoryButton = ({ title, active, outlined }: { title: string; active: boolean; outlined?: boolean }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        active && styles.activeCategoryButton,
        outlined && styles.outlinedCategoryButton,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          active && styles.activeCategoryText,
          outlined && styles.outlinedCategoryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const MusicTile = ({ item }: { item: MusicTileItem }) => (
    <TouchableOpacity 
      style={[
        styles.musicTile, 
        { backgroundColor: item.backgroundColor }
      ]}
    >
      <View style={styles.tileContent}>
        {item.image && (
          <Image source={item.image} style={styles.tileImage} />
        )}
        {/* {item.hasRepeatIcon && (
          <View style={styles.repeatIconContainer}>
            <MaterialIcons name="repeat" size={24} color="#1DB954" />
          </View>
        )} */}
        {item.isMissedHits && (
          <View style={styles.missedHitsContainer}>
            <Text style={styles.missedHitsLabel}>Missed Hits</Text>
          </View>
        )}
        <Text style={styles.tileTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../../assets/images/profile_picture.png')}
            style={styles.profileImage}
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              title={category.title}
              active={category.active}
              outlined={category.outlined}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Grid */}
        <View style={styles.grid}>
          {musicTiles.map((item) => (
            <MusicTile key={item.id} item={item} />
          ))}
        </View>

        {/* Picked for you section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Picked for you</Text>
          
          <TouchableOpacity style={styles.pickedCard}>
            <Image
              source={require('../../../assets/images/picked.png')}
              style={styles.pickedImage}
            />
            <View style={styles.pickedContent}>
              <View style={styles.pickedTextContainer}>
                <Text style={styles.pickedSubtitle}>Playlist</Text>
                <Text style={styles.pickedTitle}>K-Pop Gaming</Text>
                <Text style={styles.pickedDescription}>
                  Enjoy fantastic gameplay with K-pop music!
                </Text>
              </View>
              <View style={styles.pickedActions}>
                <TouchableOpacity style={styles.addButton}>
                  <Add/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trending albums section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending albums for you</Text>
          
          <TouchableOpacity style={styles.trendingCard}>
            <Image
              source={{ uri: 'https://picsum.photos/60/60?random=album' }}
              style={styles.trendingImage}
            />
            <View style={styles.trendingContent}>
              <Text style={styles.trendingTitle}>Paint The Town Red</Text>
              <Text style={styles.trendingArtist}>Doja Cat</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#b3b3b3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButtonSmall}>
              <Ionicons name="play" size={16} color="#000" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <NowPlayingBar 
        cover={require('../../../assets/images/now_playing.png')}
        title="Paint The Town Red"
        artist="Doja Cat"
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#000',
  },
  profileContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#1DB954',
  },
  outlinedCategoryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#b3b3b3',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#000',
  },
  outlinedCategoryText: {
    color: '#b3b3b3',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  musicTile: {
    width: '48%',
    height: 56,
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tileContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 12,
    // paddingVertical: 8,
  },
  tileImage: {
    width: 56,
    height: '100%',
    borderRadius: 0,
    marginRight: 12,
  },
  repeatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  missedHitsContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  missedHitsLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  tileTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  section: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickedCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    height: 152,
    // padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickedImage: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 16,
  },
  pickedContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 16,
  },
  pickedTextContainer: {
    flex: 1,
  },
  pickedSubtitle: {
    color: '#b3b3b3',
    fontSize: 13,
    marginBottom: 4,
  },
  pickedTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pickedDescription: {
    color: '#b3b3b3',
    fontSize: 10,
    lineHeight: 16,
    marginBottom: 4,
  },
  pickedActions: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  addButton: {
    
  },
  playButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  trendingImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trendingArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  moreButton: {
    marginRight: 12,
  },
  playButtonSmall: {
    backgroundColor: '#1DB954',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default MusicApp;