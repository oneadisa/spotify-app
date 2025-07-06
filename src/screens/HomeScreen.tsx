import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NowPlayingBar from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import Add from '@/components/icons/add.tsx';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { showToast } from '../utils/toast';
import { useTheme } from '../theme/ThemeProvider';

const fallbackTileImages = [
  require('../../assets/images/homescreen/musictiles/just_hits.png'),
  require('../../assets/images/homescreen/musictiles/christmas_vibes.png'),
  require('../../assets/images/homescreen/musictiles/on_repeat.png'),
  require('../../assets/images/homescreen/musictiles/daily_mix_1.png'),
  require('../../assets/images/homescreen/musictiles/baddie.png'),
  require('../../assets/images/homescreen/musictiles/ariana_grande_radio.png'),
  require('../../assets/images/homescreen/musictiles/k-pop_gaming.png'),
  require('../../assets/images/homescreen/musictiles/missed_hits.png'),
];

const HomeScreen = () => {
  const { isAuthenticated, profileImage, logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { themePreference, setThemePreference, isDarkMode, colors } = useTheme();
  const {
    getRecentlyPlayed,
    getUserTopItems,
    getNewReleases,
    isLoading: apiLoading,
    error: apiError,
  } = useSpotifyApi();

  // State for each section
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState(true);
  const [recentlyPlayedError, setRecentlyPlayedError] = useState<string | null>(null);
  const [activePill, setActivePill] = useState<string>('All');

  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);
  const [newReleasesError, setNewReleasesError] = useState<string | null>(null);

  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topArtistsLoading, setTopArtistsLoading] = useState(true);
  const [topArtistsError, setTopArtistsError] = useState<string | null>(null);

  const [topMixes, setTopMixes] = useState<any[]>([]);
  const [topMixesLoading, setTopMixesLoading] = useState(true);
  const [topMixesError, setTopMixesError] = useState<string | null>(null);

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Fetch Recently Played
  useEffect(() => {
    setRecentlyPlayedLoading(true);
    getRecentlyPlayed(8)
      .then((data) => {
        setRecentlyPlayed(data?.items?.slice(0, 8) || []);
        setRecentlyPlayedError(null);
      })
      .catch((e) => setRecentlyPlayedError('Failed to load recently played'))
      .finally(() => setRecentlyPlayedLoading(false));
  }, []);

  // Fetch New Releases
  useEffect(() => {
    setNewReleasesLoading(true);
    getNewReleases(10)
      .then((data) => {
        setNewReleases(data?.albums?.items || []);
        setNewReleasesError(null);
      })
      .catch((e) => setNewReleasesError('Failed to load new releases'))
      .finally(() => setNewReleasesLoading(false));
  }, []);

  // Fetch Top Artists
  useEffect(() => {
    setTopArtistsLoading(true);
    getUserTopItems('artists', { limit: 10 })
      .then((data) => {
        setTopArtists(data?.items || []);
        setTopArtistsError(null);
      })
      .catch((e) => setTopArtistsError('Failed to load artists'))
      .finally(() => setTopArtistsLoading(false));
  }, []);

  // Fetch Top Mixes (tracks)
  useEffect(() => {
    setTopMixesLoading(true);
    getUserTopItems('tracks', { limit: 10 })
      .then((data) => {
        setTopMixes(data?.items || []);
        setTopMixesError(null);
      })
      .catch((e) => setTopMixesError('Failed to load top mixes'))
      .finally(() => setTopMixesLoading(false));
  }, []);

  // Debug: log themePreference and colors on each render
  useEffect(() => {
    console.log('themePreference:', themePreference, 'colors:', colors);
  }, [themePreference, colors]);

  // Music Tile (Recently Played, grid style)
  const MusicTile = ({ item, idx }: { item: any; idx: number }) => (
    <TouchableOpacity
      style={styles.musicTile}
      onPress={() => {
        if (item.track) {
          navigation.navigate('PlayerScreen');
        } else if (item.context?.type === 'playlist') {
          navigation.navigate('Playlist', { id: item.context.uri.split(':').pop() });
        }
      }}
    >
      <View style={styles.tileContent}>
        <Image
          source={item.track?.album?.images?.[0]?.url ? { uri: item.track.album.images[0].url } : fallbackTileImages[idx % fallbackTileImages.length]}
          style={styles.tileImage}
        />
        <Text style={styles.tileTitle} numberOfLines={2}>
          {item.track?.name || 'Unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Artist Card
  const ArtistCard = ({ artist }: { artist: any }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => navigation.navigate('Artist', { id: artist.id, name: artist.name })}
    >
      <Image
        source={artist.images?.[0]?.url ? { uri: artist.images[0].url } : require('../../assets/images/profile_picture.png')}
        style={styles.artistImage}
      />
      <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
    </TouchableOpacity>
  );

  // Album Card (New Releases)
  const AlbumCard = ({ album }: { album: any }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => navigation.navigate('Album', { id: album.id, name: album.name })}
    >
      <Image
        source={album.images?.[0]?.url ? { uri: album.images[0].url } : require('../../assets/images/profile_picture.png')}
        style={styles.albumImage}
      />
      <Text style={styles.albumName} numberOfLines={1}>{album.name}</Text>
      <Text style={styles.albumArtist} numberOfLines={1}>{album.artists?.map((a: any) => a.name).join(', ')}</Text>
    </TouchableOpacity>
  );

  // Top Mix Card (Track)
  const MixCard = ({ track }: { track: any }) => (
    <TouchableOpacity
      style={styles.mixCard}
      onPress={() => navigation.navigate('PlayerScreen')}
    >
      <Image
        source={track.album?.images?.[0]?.url ? { uri: track.album.images[0].url } : require('../../assets/images/profile_picture.png')}
        style={styles.mixImage}
      />
      <Text style={styles.mixName} numberOfLines={1}>{track.name}</Text>
      <Text style={styles.mixArtist} numberOfLines={1}>{track.artists?.map((a: any) => a.name).join(', ')}</Text>
    </TouchableOpacity>
  );

  const handleThemeToggle = async () => {
    const next =
      themePreference === 'light'
        ? 'dark'
        : themePreference === 'dark'
        ? 'system'
        : 'light';
    await setThemePreference(next);
    showToast(`Theme set to ${next}`, 'info');
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out', 'success');
    navigation.replace('Login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: 8,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
    },
    profileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    pillsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
    },
    pill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.card,
      borderRadius: 20,
      marginRight: 8,
    },
    pillActive: {
      backgroundColor: colors.primary,
    },
    pillText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    pillTextActive: {
      color: colors.buttonText,
      fontWeight: 'bold',
    },
    pillOutlined: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginRight: 8,
    },
    pillTextOutlined: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 12,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 16,
    },
    errorText: {
      color: colors.error,
      marginVertical: 8,
    },
    musicTilesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    musicTile: {
      width: '48%',
      height: 56,
      borderRadius: 6,
      marginBottom: 12,
      overflow: 'hidden',
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tileContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tileImage: {
      width: 56,
      height: '100%',
      borderRadius: 0,
      marginRight: 12,
    },
    tileTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      flex: 1,
      lineHeight: 18,
    },
    albumRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    albumCard: {
      width: 120,
      marginRight: 12,
      alignItems: 'center',
    },
    albumImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginBottom: 8,
    },
    albumName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    albumArtist: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    mixRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    mixCard: {
      width: 120,
      marginRight: 12,
      alignItems: 'center',
    },
    mixImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginBottom: 8,
    },
    mixName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    mixArtist: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    artistRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    artistCard: {
      width: 90,
      marginRight: 12,
      alignItems: 'center',
    },
    artistImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 8,
    },
    artistName: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
    },
    section: {
      marginTop: 12,
      marginBottom: 16,
    },
    pickedCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      height: 152,
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
      padding: 16,
    },
    pickedTextContainer: {
      flex: 1,
    },
    pickedSubtitle: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },
    pickedTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    pickedDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    pickedActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    playButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.navigate('User'); showToast('Profile opened', 'info'); }}>
            <Image
              key={profileImage || 'default'}
              source={profileImage ? { uri: profileImage } : require('../../assets/images/profile_picture.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          {/* Pills beside profile picture */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
        >
            {['All', 'Music', 'Podcasts', 'Wrapped'].map((pill) => (
              <TouchableOpacity 
                key={pill}
                style={[
                  styles.pill, 
                  activePill === pill && styles.pillActive
                ]}
                onPress={() => setActivePill(pill)}
              >
                <Text style={[
                  styles.pillText, 
                  activePill === pill && styles.pillTextActive
                ]}>
                  {pill}
                </Text>
              </TouchableOpacity>
          ))}
        </ScrollView>
          <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={{ marginLeft: 30 }}>
            <Ionicons name="settings-outline" size={28} color={colors.text} />
          </TouchableOpacity>
      </View>

        {/* Music Tiles Grid (Recently Played) */}
        <Text style={styles.sectionTitle}>Recently played</Text>
        {recentlyPlayedLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : recentlyPlayedError ? (
          <Text style={styles.errorText}>{recentlyPlayedError}</Text>
        ) : (
          <View style={styles.musicTilesGrid}>
            {recentlyPlayed.map((item, idx) => (
              <MusicTile key={item.played_at || idx} item={item} idx={idx} />
          ))}
        </View>
        )}

        {/* Picked for you section (unchanged) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Picked for you</Text>
          <TouchableOpacity style={styles.pickedCard}>
            <Image
              source={require('../../assets/images/picked.png')}
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
                  <Ionicons name="play" size={24} color={colors.buttonText} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* New Releases */}
        <Text style={styles.sectionTitle}>New releases for you</Text>
        {newReleasesLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : newReleasesError ? (
          <Text style={styles.errorText}>{newReleasesError}</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumRow}>
            {newReleases.map((album, idx) => (
              <AlbumCard key={album.id || idx} album={album} />
            ))}
          </ScrollView>
        )}

        {/* Your Top Mixes */}
        <Text style={styles.sectionTitle}>Your top mixes</Text>
        {topMixesLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : topMixesError ? (
          <Text style={styles.errorText}>{topMixesError}</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mixRow}>
            {topMixes.map((track, idx) => (
              <MixCard key={track.id || idx} track={track} />
            ))}
          </ScrollView>
        )}

        {/* My Artists */}
        <Text style={styles.sectionTitle}>My artists</Text>
        {topArtistsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : topArtistsError ? (
          <Text style={styles.errorText}>{topArtistsError}</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistRow}>
            {topArtists.map((artist, idx) => (
              <ArtistCard key={artist.id || idx} artist={artist} />
            ))}
          </ScrollView>
        )}
      </ScrollView>
      <NowPlayingBar />
      {/* Settings Bottom Sheet Modal */}
      <Modal
        visible={isSettingsVisible}
        onRequestClose={() => setIsSettingsVisible(false)}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay }}
          activeOpacity={1}
          onPress={() => setIsSettingsVisible(false)}
        />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.card,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 24,
          paddingBottom: 40,
        }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 40,
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.border,
              alignSelf: 'center',
              marginBottom: 8,
            }} />
            </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <TouchableOpacity style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: colors.card,
              borderRadius: 20,
              marginRight: 8,
            }} onPress={handleThemeToggle}>
              <Text style={{ color: colors.text, fontSize: 18 }}>
                {themePreference === 'light' ? '☀️' : themePreference === 'dark' ? '🌙' : '🖥️'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
                backgroundColor: colors.primary,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 8,
              }}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={32} color={colors.buttonText} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;