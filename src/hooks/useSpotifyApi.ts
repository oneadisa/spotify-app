import { useState, useCallback } from 'react';
import { SPOTIFY_CONFIG } from '../config/spotify';
import { apiRequest, withApiHandler } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export const useSpotifyApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { refreshAccessToken } = useAuth();

  // Helper function to make API requests with loading and error states
  const makeRequest = useCallback(async <T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: Record<string, any> | FormData | null;
      headers?: Record<string, string>;
      authRequired?: boolean;
    } = {}
  ): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);

    let triedRefresh = false;
    try {
      const url = `${SPOTIFY_CONFIG.apiBaseUrl}${endpoint}`;
      let response;
      try {
        response = await apiRequest<T>(url, {
          method: options.method || 'GET',
          body: options.body,
          headers: options.headers,
          authRequired: options.authRequired !== false, // Default to true
        });
      } catch (err: any) {
        // If token expired, try to refresh ONCE
        if (
          err?.message?.toLowerCase().includes('access token expired') &&
          !triedRefresh
        ) {
          triedRefresh = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Try the request again after refresh
            response = await apiRequest<T>(url, {
              method: options.method || 'GET',
              body: options.body,
              headers: options.headers,
              authRequired: options.authRequired !== false,
            });
          } else {
            throw new Error('Failed to refresh access token') as any;
          }
        } else {
          throw err;
        }
      }
      return response;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Only redirect to AuthScreen if we can't refresh the token
      if (err?.message?.toLowerCase().includes('access token expired') && triedRefresh) {
        try {
          navigation.reset({ index: 0, routes: [{ name: 'Login' as any }] });
        } catch (navError) {
          console.warn('Navigation error:', navError);
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigation, refreshAccessToken]);

  // User endpoints
  const getCurrentUserProfile = useCallback(async () => {
    return withApiHandler(() => makeRequest('/me'));
  }, [makeRequest]);

  const getUserTopItems = useCallback(async (
    type: 'tracks' | 'artists',
    options: {
      limit?: number;
      offset?: number;
      time_range?: 'short_term' | 'medium_term' | 'long_term';
    } = {}
  ) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.time_range) params.append('time_range', options.time_range);

    return withApiHandler(() => makeRequest(`/me/top/${type}?${params.toString()}`));
  }, [makeRequest]);

  // Player endpoints
  const getCurrentlyPlaying = useCallback(async () => {
    return withApiHandler(() => makeRequest('/me/player/currently-playing'));
  }, [makeRequest]);

  const getRecentlyPlayed = useCallback(async (limit: number = 20) => {
    return withApiHandler(() => makeRequest(`/me/player/recently-played?limit=${limit}`));
  }, [makeRequest]);

  const startPlayback = useCallback(async (options: {
    context_uri?: string;
    uris?: string[];
    offset?: { position: number } | { uri: string };
    position_ms?: number;
  } = {}) => {
    return withApiHandler(() => 
      makeRequest('/me/player/play', {
        method: 'PUT',
        body: options,
      })
    );
  }, [makeRequest]);

  const pausePlayback = useCallback(async () => {
    return withApiHandler(() => 
      makeRequest('/me/player/pause', {
        method: 'PUT',
      })
    );
  }, [makeRequest]);

  const skipToNext = useCallback(async () => {
    return withApiHandler(() => 
      makeRequest('/me/player/next', {
        method: 'POST',
      })
    );
  }, [makeRequest]);

  const skipToPrevious = useCallback(async () => {
    return withApiHandler(() => 
      makeRequest('/me/player/previous', {
        method: 'POST',
      })
    );
  }, [makeRequest]);

  // Search endpoints
  const search = useCallback(async (
    query: string,
    types: Array<'album' | 'artist' | 'playlist' | 'track'> = ['track'],
    options: { limit?: number; offset?: number } = {}
  ) => {
    const params = new URLSearchParams({
      q: query,
      type: types.join(','),
      ...(options.limit && { limit: options.limit.toString() }),
      ...(options.offset && { offset: options.offset.toString() }),
    });

    return withApiHandler(() => makeRequest(`/search?${params.toString()}`));
  }, [makeRequest]);

  // Playlist endpoints
  const getPlaylist = useCallback(async (playlistId: string) => {
    return withApiHandler(() => makeRequest(`/playlists/${playlistId}`));
  }, [makeRequest]);

  const getUserPlaylists = useCallback(async (limit: number = 20, offset: number = 0) => {
    return withApiHandler(() => 
      makeRequest(`/me/playlists?limit=${limit}&offset=${offset}`)
    );
  }, [makeRequest]);

  // Track endpoints
  const getTrack = useCallback(async (trackId: string) => {
    return withApiHandler(() => makeRequest(`/tracks/${trackId}`));
  }, [makeRequest]);

  // Artist endpoints
  const getArtist = useCallback(async (artistId: string) => {
    return withApiHandler(() => makeRequest(`/artists/${artistId}`));
  }, [makeRequest]);

  const getArtistTopTracks = useCallback(async (artistId: string, market: string = 'US') => {
    return withApiHandler(() => 
      makeRequest(`/artists/${artistId}/top-tracks?market=${market}`)
    );
  }, [makeRequest]);

  const getArtistAlbums = useCallback(async (
    artistId: string,
    options: {
      include_groups?: string;
      market?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    if (options.include_groups) params.append('include_groups', options.include_groups);
    if (options.market) params.append('market', options.market);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    return withApiHandler(() => 
      makeRequest(`/artists/${artistId}/albums?${params.toString()}`)
    );
  }, [makeRequest]);

  // Album endpoints
  const getAlbum = useCallback(async (albumId: string) => {
    return withApiHandler(() => makeRequest(`/albums/${albumId}`));
  }, [makeRequest]);

  const getAlbumTracks = useCallback(async (
    albumId: string,
    options: { limit?: number; offset?: number } = {}
  ) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    return withApiHandler(() => 
      makeRequest(`/albums/${albumId}/tracks?${params.toString()}`)
    );
  }, [makeRequest]);

  // Playlist management
  const createPlaylist = useCallback(async (userId: string, name: string, description: string = '', isPublic: boolean = true) => {
    return withApiHandler(() => makeRequest(`/users/${userId}/playlists`, {
      method: 'POST',
      body: {
        name,
        description,
        public: isPublic,
      },
    }));
  }, [makeRequest]);

  const updatePlaylistDetails = useCallback(async (playlistId: string, name: string, description: string = '', isPublic: boolean = true) => {
    return withApiHandler(() => makeRequest(`/playlists/${playlistId}`, {
      method: 'PUT',
      body: {
        name,
        description,
        public: isPublic,
      },
    }));
  }, [makeRequest]);

  const addTracksToPlaylist = useCallback(async (playlistId: string, uris: string[]) => {
    if (!Array.isArray(uris) || uris.length === 0 || uris.some(u => typeof u !== 'string' || !u.startsWith('spotify:track:'))) {
      throw new Error('No valid track URIs provided.');
    }
    return withApiHandler(() => makeRequest(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: {
        uris,
      },
    }));
  }, [makeRequest]);

  const removeTracksFromPlaylist = useCallback(async (playlistId: string, uris: string[]) => {
    if (!Array.isArray(uris) || uris.length === 0 || uris.some(u => typeof u !== 'string' || !u.startsWith('spotify:track:'))) {
      throw new Error('No valid track URIs provided.');
    }
    return withApiHandler(() => makeRequest(`/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      body: {
        tracks: uris.map(uri => ({
          uri: uri,
          positions: [] // Required by the API, but we're not specifying positions
        }))
      },
    }));
  }, [makeRequest]);

  // New Releases endpoint
  const getNewReleases = useCallback(async (limit: number = 20, offset: number = 0) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return withApiHandler(() => makeRequest(`/browse/new-releases?${params.toString()}`));
  }, [makeRequest]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    // Spotify API: DELETE /playlists/{playlist_id}/followers
    return withApiHandler(() => makeRequest(`/playlists/${playlistId}/followers`, {
      method: 'DELETE',
    }));
  }, [makeRequest]);

  return {
    isLoading,
    error,
    makeRequest,
    getCurrentUserProfile,
    getUserTopItems,
    getCurrentlyPlaying,
    getRecentlyPlayed,
    startPlayback,
    pausePlayback,
    skipToNext,
    skipToPrevious,
    search,
    getPlaylist,
    getUserPlaylists,
    getTrack,
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
    getAlbum,
    getAlbumTracks,
    createPlaylist,
    updatePlaylistDetails,
    addTracksToPlaylist,
    removeTracksFromPlaylist,
    getNewReleases,
    deletePlaylist,
  };
};

export default useSpotifyApi;
