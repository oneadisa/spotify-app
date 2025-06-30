import { useState, useCallback } from 'react';
import { SPOTIFY_CONFIG } from '../config/spotify';
import { apiRequest, withApiHandler } from '../utils/api';

export const useSpotifyApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const url = `${SPOTIFY_CONFIG.apiBaseUrl}${endpoint}`;
      const response = await apiRequest<T>(url, {
        method: options.method || 'GET',
        body: options.body,
        headers: options.headers,
        authRequired: options.authRequired !== false, // Default to true
      });

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return {
    // State
    isLoading,
    error,
    
    // Core
    makeRequest,
    
    // User
    getCurrentUserProfile,
    getUserTopItems,
    
    // Player
    getCurrentlyPlaying,
    getRecentlyPlayed,
    startPlayback,
    pausePlayback,
    skipToNext,
    skipToPrevious,
    
    // Search
    search,
    
    // Playlist
    getPlaylist,
    getUserPlaylists,
    
    // Track
    getTrack,
    
    // Artist
    getArtist,
    getArtistTopTracks,
    getArtistAlbums,
    
    // Album
    getAlbum,
    getAlbumTracks,
  };
};

export default useSpotifyApi;
