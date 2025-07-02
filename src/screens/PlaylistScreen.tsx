import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../components/icons/back.tsx';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SearchStackParamList } from '../navigation/types';
import { getTrackPreview, useAudioPlayer, AdvancedAudioService } from '../services/audioService';
import { Ionicons } from '@expo/vector-icons';

const PlaylistScreen = () => {
  const theme = useTheme();
  const { getUserPlaylists, getPlaylist, getCurrentUserProfile, createPlaylist, addTracksToPlaylist, removeTracksFromPlaylist, isLoading, error } = useSpotifyApi();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [playlistDetails, setPlaylistDetails] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // trackId for add/remove
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<SearchStackParamList, 'Playlist'>>();
  const route = useRoute<any>();
  const playlistId = route.params?.id;
  const { isPlaying, isLoading: audioLoading, play, stop } = useAudioPlayer();
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUserProfile();
        setUserId(user?.id || null);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (playlistId) {
      // Fetch playlist details and tracks
      (async () => {
        setLoading(true);
        setFetchError(null);
        try {
          const data = await getPlaylist(playlistId);
          setPlaylistDetails(data);
          setTracks(data?.tracks?.items?.filter(Boolean) || []);
        } catch (e: any) {
          setFetchError(e?.message || 'Failed to fetch playlist');
        } finally {
          setLoading(false);
        }
      })();
    } else {
      // Fetch all playlists
      (async () => {
        setLoading(true);
        setFetchError(null);
        try {
          const data = await getUserPlaylists(50, 0);
          setPlaylists(data?.items?.filter(Boolean) || []);
        } catch (e: any) {
          setFetchError(e?.message || 'Failed to fetch playlists');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [playlistId]);

  // Create playlist handler
  const handleCreatePlaylist = async () => {
    if (!userId || !newPlaylistName.trim()) return;
    setCreating(true);
    try {
      const newPl = await createPlaylist(userId, newPlaylistName.trim(), newPlaylistDesc.trim());
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      // Refresh playlists
      const data = await getUserPlaylists(50, 0);
      setPlaylists(data?.items?.filter(Boolean) || []);
      Alert.alert('Success', 'Playlist created!');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  // Add track handler
  const handleAddTrack = async (trackUri: string) => {
    if (!playlistId) return;
    setActionLoading(trackUri);
    try {
      await addTracksToPlaylist(playlistId, [trackUri]);
      Alert.alert('Success', 'Track added!');
      // Optionally refresh playlist
      const data = await getPlaylist(playlistId);
      setPlaylistDetails(data);
      setTracks(data?.tracks?.items?.filter(Boolean) || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to add track');
    } finally {
      setActionLoading(null);
    }
  };

  // Remove track handler
  const handleRemoveTrack = async (trackUri: string) => {
    if (!playlistId) return;
    setActionLoading(trackUri);
    try {
      await removeTracksFromPlaylist(playlistId, [trackUri]);
      Alert.alert('Success', 'Track removed!');
      // Optionally refresh playlist
      const data = await getPlaylist(playlistId);
      setPlaylistDetails(data);
      setTracks(data?.tracks?.items?.filter(Boolean) || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to remove track');
    } finally {
      setActionLoading(null);
    }
  };

  // Play/stop preview handler for playlist tracks
  const handlePreview = async (track: any) => {
    if (previewingTrackId === track.id) {
      await stop();
      setPreviewingTrackId(null);
      return;
    }
    setPreviewingTrackId(track.id);
    try {
      const previewUrl = await getTrackPreview(track.artists?.[0]?.name || '', track.name);
      if (!previewUrl) throw new Error('No preview available');
      await play(previewUrl, {
        id: track.id,
        title: track.name,
        artist: track.artists?.map((a: any) => a?.name).filter(Boolean).join(', '),
        artwork: track.album?.images?.[0]?.url,
      });
    } catch (e: any) {
      Alert.alert('Preview not available', e?.message || 'Preview not available');
      setPreviewingTrackId(null);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      </ScreenWrapper>
    );
  }

  if (fetchError) {
    return (
      <ScreenWrapper>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{fetchError}</Text>
      </ScreenWrapper>
    );
  }

  // Playlist details view
  if (playlistId && playlistDetails) {
    return (
      <ScreenWrapper>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16, top: 16, zIndex: 10 }}>
              <BackButton />
            </TouchableOpacity>
            <Image
              source={playlistDetails.images && playlistDetails.images[0]?.url ? { uri: playlistDetails.images[0].url } : require('../../assets/images/profile_picture.png')}
              style={styles.playlistImageLarge}
            />
            <Text style={[styles.title, { color: theme.colors.text }]}>{playlistDetails.name}</Text>
            <Text style={[styles.playlistDesc, { color: theme.colors.textSecondary }]}>{playlistDetails.owner?.display_name || 'Unknown Owner'}</Text>
            <Text style={[styles.playlistDesc, { color: theme.colors.textSecondary, marginTop: 4 }]}>{playlistDetails.description || ''}</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginLeft: 16 }]}>Tracks</Text>
          {tracks.length === 0 && (
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 }}>No tracks found.</Text>
          )}
          {tracks.map((item, idx) => {
            const track = item.track || item; // API shape
            return (
              <View key={track.id || idx} style={styles.trackItem}>
                <Text style={[styles.trackNumber, { color: theme.colors.textSecondary }]}>{idx + 1}</Text>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: theme.colors.text }]} numberOfLines={1}>{track.name}</Text>
                  <Text style={[styles.trackArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>{track.artists?.filter(Boolean).map((a: any) => a?.name).filter(Boolean).join(', ') || 'Unknown Artist'}</Text>
                </View>
                <TouchableOpacity
                  style={{ marginLeft: 12 }}
                  onPress={() => handlePreview(track)}
                  disabled={audioLoading && previewingTrackId === track.id}
                >
                  {audioLoading && previewingTrackId === track.id ? (
                    <ActivityIndicator color="#1DB954" size={20} />
                  ) : (
                    <Ionicons name={isPlaying && previewingTrackId === track.id ? 'stop-circle' : 'play-circle'} size={28} color="#1DB954" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 12 }}
                  onPress={() => handleRemoveTrack(track.uri)}
                  disabled={actionLoading === track.uri}
                >
                  <Text style={{ color: 'red', fontSize: 12 }}>{actionLoading === track.uri ? '...' : 'Remove'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {/* Add Track UI: For demo, add a text input for a track URI */}
          <View style={{ margin: 16 }}>
            <Text style={{ color: theme.colors.text, marginBottom: 8 }}>Add Track by URI:</Text>
            <AddTrackInput onAdd={handleAddTrack} loading={!!actionLoading} />
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // All playlists view
  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 16, marginBottom: 8 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Your Playlists</Text>
          <TouchableOpacity style={{ marginLeft: 12, backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }} onPress={() => setShowCreateModal(true)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ New</Text>
          </TouchableOpacity>
        </View>
        {playlists.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 }}>No playlists found.</Text>
        )}
        {playlists.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={styles.playlistItem}
            onPress={() => navigation.navigate('Playlist', { id: playlist.id, name: playlist.name })}
          >
            <Image
              source={playlist.images && playlist.images[0]?.url ? { uri: playlist.images[0].url } : require('../../assets/images/profile_picture.png')}
              style={styles.playlistImage}
            />
            <View style={styles.playlistInfo}>
              <Text style={[styles.playlistName, { color: theme.colors.text }]} numberOfLines={1}>{playlist.name}</Text>
              <Text style={[styles.playlistDesc, { color: theme.colors.textSecondary }]} numberOfLines={1}>{playlist.owner?.display_name || 'Unknown Owner'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Create Playlist Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.background, padding: 24, borderRadius: 12, width: '85%' }}>
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Create Playlist</Text>
            <TextInput
              placeholder="Playlist Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              style={{ color: theme.colors.text, borderBottomWidth: 1, borderBottomColor: theme.colors.textSecondary, marginBottom: 16, fontSize: 16 }}
            />
            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newPlaylistDesc}
              onChangeText={setNewPlaylistDesc}
              style={{ color: theme.colors.text, borderBottomWidth: 1, borderBottomColor: theme.colors.textSecondary, marginBottom: 24, fontSize: 16 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{ marginRight: 16 }} disabled={creating}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreatePlaylist} disabled={creating || !newPlaylistName.trim()} style={{ backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{creating ? 'Creating...' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

// AddTrackInput: simple input for demo
const AddTrackInput = ({ onAdd, loading }: { onAdd: (uri: string) => void; loading: boolean }) => {
  const [uri, setUri] = useState('');
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        placeholder="spotify:track:..."
        value={uri}
        onChangeText={setUri}
        style={{ flex: 1, color: '#fff', borderBottomWidth: 1, borderBottomColor: '#555', marginRight: 8, fontSize: 15 }}
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={() => { if (uri.trim()) { onAdd(uri.trim()); setUri(''); } }} disabled={loading || !uri.trim()} style={{ backgroundColor: '#1DB954', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? '...' : 'Add'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  playlistImageLarge: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#222',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#222',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
  },
  playlistDesc: {
    fontSize: 14,
    opacity: 0.7,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
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
