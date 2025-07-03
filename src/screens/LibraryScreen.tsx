import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import NowPlayingBar from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import { showToast } from '../utils/toast';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { Ionicons } from '@expo/vector-icons';
import { usePlaylists } from '../contexts/PlaylistContext';

const { height } = Dimensions.get('window');

const LibraryScreen = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Library'>>();
  const { themePreference, setThemePreference } = useTheme();
  const { createPlaylist, getCurrentUserProfile, updatePlaylistDetails, deletePlaylist, getUserPlaylists } = useSpotifyApi();
  const { playlists, loading, error, refreshPlaylists, updatePlaylist } = usePlaylists();

  // Fetch playlists when component mounts
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getUserPlaylists(50, 0);
        refreshPlaylists(data?.items?.filter(Boolean) || []);
      } catch (err) {
        console.error('Error fetching playlists:', err);
      }
    };
    
    fetchPlaylists();
  }, []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState<string | null>(null);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [editPlaylistDesc, setEditPlaylistDesc] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUserProfile();
        setUserId(user?.id || null);
      } catch {}
    })();
  }, []);

  // Create playlist handler
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || !userId) return;
    
    setCreating(true);
    try {
      const newPlaylist = await createPlaylist(
        userId,
        newPlaylistName.trim(),
        newPlaylistDesc.trim()
      );
      
      // Refresh the playlists after creating a new one
      const data = await getUserPlaylists(50, 0);
      refreshPlaylists(data?.items?.filter(Boolean) || []);
      
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      showToast('Playlist created!');
    } catch (err) {
      console.error('Error creating playlist:', err);
      showToast('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  // Edit playlist handler
  const handleUpdatePlaylist = async () => {
    if (!editPlaylistId || !editPlaylistName.trim()) return;
    
    setEditing(true);
    try {
      await updatePlaylistDetails(
        editPlaylistId,
        editPlaylistName.trim(),
        editPlaylistDesc.trim()
      );
      
      // Update the local state immediately for a snappier UI
      updatePlaylist(editPlaylistId, {
        name: editPlaylistName.trim(),
        description: editPlaylistDesc.trim()
      });
      
      // Also refresh the full list to ensure consistency
      const data = await getUserPlaylists(50, 0);
      refreshPlaylists(data?.items?.filter(Boolean) || []);
      
      setShowEditModal(false);
      showToast('Playlist updated!');
    } catch (err) {
      console.error('Error updating playlist:', err);
      showToast('Failed to update playlist');
    } finally {
      setEditing(false);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlaylist(playlistId);
              showToast('Playlist deleted!');
              // Refresh the full list after deletion
              const data = await getUserPlaylists(50, 0);
              refreshPlaylists(data?.items?.filter(Boolean) || []);
            } catch (err) {
              console.error('Error deleting playlist:', err);
              showToast('Failed to delete playlist');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Your Library</Text>
            <TouchableOpacity 
              style={[styles.themeButton, { 
                marginLeft: 0,
                backgroundColor: '#1DB954', // Spotify green
              }]} 
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={[styles.themeButtonText, { color: '#000000' }]}>+</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            </View>
          ) : playlists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Library Empty for now</Text>
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
              {playlists.map((playlist) => (
                <View key={playlist.id} style={styles.playlistItemRow}>
                  <TouchableOpacity
                    style={styles.playlistItem}
                    onPress={() => navigation.navigate('Playlist', { id: playlist.id, name: playlist.name })}
                    onLongPress={() => {
                      setEditPlaylistId(playlist.id);
                      setEditPlaylistName(playlist.name);
                      setEditPlaylistDesc(playlist.description || '');
                      setShowEditModal(true);
                    }}
                  >
                    <View style={styles.playlistImageContainer}>
                      {playlist.images?.[0]?.url ? (
                        <Image
                          source={{ uri: playlist.images[0].url }}
                          style={styles.playlistImage}
                        />
                      ) : (
                        <Ionicons name="musical-notes" size={30} color="#b3b3b3" />
                      )}
                    </View>
                    <View style={styles.playlistInfo}>
                      <Text style={[styles.playlistName, { color: theme.colors.text }]} numberOfLines={1}>{playlist.name}</Text>
                      <Text style={[styles.playlistDesc, { color: theme.colors.textSecondary }]} numberOfLines={1}>{playlist.owner?.display_name || 'Unknown Owner'}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteButton, { position: 'absolute', right: 10, padding: 8, zIndex: 2 }]} onPress={() => handleDeletePlaylist(playlist.id)} accessibilityLabel="Delete playlist" testID={`delete-playlist-${playlist.id}`}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        {/* Create Playlist Modal */}
        {showCreateModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Playlist</Text>
              <TextInput
                placeholder="Playlist Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPlaylistDesc}
                onChangeText={setNewPlaylistDesc}
                style={styles.modalInput}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{ marginRight: 16 }} disabled={creating}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreatePlaylist} disabled={creating || !newPlaylistName.trim()} style={{ backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{creating ? 'Creating...' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Edit Playlist Modal */}
        {showEditModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Playlist</Text>
              <TextInput
                placeholder="Playlist Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={editPlaylistName}
                onChangeText={setEditPlaylistName}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor={theme.colors.textSecondary}
                value={editPlaylistDesc}
                onChangeText={setEditPlaylistDesc}
                style={styles.modalInput}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowEditModal(false)} style={{ marginRight: 16 }} disabled={editing}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdatePlaylist} disabled={editing || !editPlaylistName.trim()} style={{ backgroundColor: theme.colors.primary, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{editing ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScreenWrapper>
      <NowPlayingBar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#1DB954',
    borderRadius: 20,
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#222',
    borderRadius: 20,
    marginRight: 8,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    flex: 1,
    marginRight: 10,
  },
  playlistImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playlistInfo: {
    flex: 1,
    marginRight: 10, 
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: '90%', 
  },
  playlistDesc: {
    fontSize: 14,
    opacity: 0.7,
  },
  createButton: {
    backgroundColor: '#1DB954',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#181818',
    padding: 24,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 6,
  },
  playlistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    padding: 8,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
  },
});

export default LibraryScreen;
