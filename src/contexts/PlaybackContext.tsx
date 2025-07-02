import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useAuth } from './AuthContext';

interface PlaybackState {
  track: any;
  isPlaying: boolean;
  progress: number;
  duration: number;
  artwork: string | null;
  // Add more fields as needed
}

interface PlaybackContextType extends PlaybackState {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

interface PreviewState {
  isPreviewPlaying: boolean;
  previewTitle: string;
  previewArtist: string;
  previewArtwork: string | null;
  previewTrackId: string | null;
}

const PlaybackContext = createContext<
  (PlaybackContextType & PreviewState & { setPreviewState: (s: Partial<PreviewState>) => void }) | undefined
>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    getCurrentlyPlaying,
    startPlayback,
    pausePlayback,
    skipToNext,
    skipToPrevious,
    isLoading,
  } = useSpotifyApi();
  
  const { isAuthenticated } = useAuth();

  const [track, setTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [artwork, setArtwork] = useState<string | null>(null);
  const [previewState, setPreviewStateInternal] = useState<PreviewState>({
    isPreviewPlaying: false,
    previewTitle: '',
    previewArtist: '',
    previewArtwork: null,
    previewTrackId: null,
  });
  const setPreviewState = (s: Partial<PreviewState>) => setPreviewStateInternal(prev => ({ ...prev, ...s }));

  const fetchPlayback = useCallback(async () => {
    // Only fetch if authenticated
    if (!isAuthenticated) return;
    
    try {
      const playback = await getCurrentlyPlaying();
      if (playback && playback.item) {
        setTrack(playback.item);
        setIsPlaying(playback.is_playing);
        setProgress(playback.progress_ms || 0);
        setDuration(playback.item.duration_ms || 0);
        setArtwork(playback.item.album?.images?.[0]?.url || null);
      } else {
        setTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
        setArtwork(null);
      }
    } catch (e) {
      setTrack(null);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      setArtwork(null);
    }
  }, [getCurrentlyPlaying, isAuthenticated]);

  useEffect(() => {
    fetchPlayback();
    const interval = setInterval(fetchPlayback, 2000);
    return () => clearInterval(interval);
  }, [fetchPlayback]);

  const play = useCallback(async () => {
    await startPlayback();
    setIsPlaying(true);
    fetchPlayback();
  }, [startPlayback, fetchPlayback]);

  const pause = useCallback(async () => {
    await pausePlayback();
    setIsPlaying(false);
    fetchPlayback();
  }, [pausePlayback, fetchPlayback]);

  const next = useCallback(async () => {
    await skipToNext();
    fetchPlayback();
  }, [skipToNext, fetchPlayback]);

  const previous = useCallback(async () => {
    await skipToPrevious();
    fetchPlayback();
  }, [skipToPrevious, fetchPlayback]);

  const value = {
    track,
    isPlaying,
    progress,
    duration,
    artwork,
    play,
    pause,
    next,
    previous,
    refresh: fetchPlayback,
    isLoading,
    ...previewState,
    setPreviewState,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error('usePlayback must be used within a PlaybackProvider');
  return ctx;
}; 