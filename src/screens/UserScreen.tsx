import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/icons/back.tsx';
import { showToast } from '../utils/toast';

const { height } = Dimensions.get('window');

const UserScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { profile, profileImage } = useAuth();
  const { getUserTopItems, getRecentlyPlayed, getUserPlaylists } = useSpotifyApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [playlistsCount, setPlaylistsCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [artistsRes, tracksRes, recentRes, playlistsRes] = await Promise.all([
          getUserTopItems('artists', { limit: 5 }),
          getUserTopItems('tracks', { limit: 5 }),
          getRecentlyPlayed(10),
          getUserPlaylists(1, 0),
        ]);
        setTopArtists(artistsRes?.items || []);
        setTopTracks(tracksRes?.items || []);
        setRecentlyPlayed(recentRes?.items || []);
        setPlaylistsCount(playlistsRes?.total || 0);
      } catch (e: any) {
        setError(e?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ color: theme.colors.text, marginTop: 16 }}>Loading user data...</Text>
    </View>;
  }
  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.error }}>{error}</Text>
    </View>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ position: 'absolute', top: 50, left: 16, zIndex: 10 }}>
        <TouchableOpacity onPress={() => { navigation.goBack(); showToast('Back', 'info'); }} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
          <BackButton />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 32 }}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/images/profile_picture.png')}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12, backgroundColor: theme.colors.card }}
          />
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold' }}>{profile?.display_name || 'User'}</Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>{profile?.email}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold' }}>{profile?.followers?.total ?? '-'}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>Followers</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: 'bold' }}>{playlistsCount}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>Playlists</Text>
          </View>
        </View>
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Top Artists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {topArtists.map((artist, idx) => (
            <View key={artist.id ? `artist-${artist.id}` : `artist-idx-${idx}`} style={{ alignItems: 'center', marginRight: 20 }}>
              <Image
                source={artist.images && artist.images[0]?.url ? { uri: artist.images[0].url } : require('../../assets/images/profile_picture.png')}
                style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.card }}
              />
              <Text style={{ color: theme.colors.text, fontSize: 14, marginTop: 8, maxWidth: 80 }} numberOfLines={1}>{artist.name}</Text>
            </View>
          ))}
        </ScrollView>
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Top Tracks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {topTracks.map((track, idx) => (
            <View key={track.id ? `track-${track.id}` : `track-idx-${idx}`} style={{ alignItems: 'center', marginRight: 20, width: 120 }}>
              <Image
                source={track.album?.images && track.album.images[0]?.url ? { uri: track.album.images[0].url } : require('../../assets/images/profile_picture.png')}
                style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: theme.colors.card }}
              />
              <Text style={{ color: theme.colors.text, fontSize: 14, marginTop: 8 }} numberOfLines={1}>{track.name}</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }} numberOfLines={1}>{track.artists?.map((a: any) => a?.name).filter(Boolean).join(', ')}</Text>
            </View>
          ))}
        </ScrollView>
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Recently Played</Text>
        {recentlyPlayed.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>No recently played tracks.</Text>}
        {recentlyPlayed.map((item, idx) => {
          const track = item.track || item;
          return (
            <View key={track.id ? `recently-${track.id}-${idx}` : `recently-idx-${idx}`} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Image
                source={track.album?.images && track.album.images[0]?.url ? { uri: track.album.images[0].url } : require('../../assets/images/profile_picture.png')}
                style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: theme.colors.card, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontSize: 16 }} numberOfLines={1}>{track.name}</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }} numberOfLines={1}>{track.artists?.map((a: any) => a?.name).filter(Boolean).join(', ')}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default UserScreen; 