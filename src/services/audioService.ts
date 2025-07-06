import TrackPlayer, { Capability, State, usePlaybackState } from 'react-native-track-player';
import { usePlayback } from '../contexts/PlaybackContext';

export class AdvancedAudioService {
  static _initialized = false;
  static async initialize() {
    if (AdvancedAudioService._initialized) return;
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
      });
      AdvancedAudioService._initialized = true;
    } catch (error) {
      console.error('Error initializing TrackPlayer:', error);
    }
  }

  static async playPreview(previewUrl: string, trackInfo: any, setPreviewState?: (s: any) => void) {
    try {
      // Pause main playback if possible
      try { await TrackPlayer.pause(); } catch {}
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: trackInfo.id,
        url: previewUrl,
        title: trackInfo.title,
        artist: trackInfo.artist,
        duration: 30, // 30-second preview
        artwork: trackInfo.artwork || undefined,
      });
      await TrackPlayer.play();
      if (setPreviewState) {
        setPreviewState({
          isPreviewPlaying: true,
          previewTitle: trackInfo.title,
          previewArtist: trackInfo.artist,
          previewArtwork: trackInfo.artwork || null,
          previewTrackId: trackInfo.id,
          previewArtistId: trackInfo.artistId || null,
        });
      }
    } catch (error) {
      console.error('Error playing preview:', error);
      if (setPreviewState) setPreviewState({ isPreviewPlaying: false, previewTrackId: null });
    }
  }

  static async stopPreview(setPreviewState?: (s: any) => void) {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      if (setPreviewState) setPreviewState({ isPreviewPlaying: false, previewTrackId: null });
    } catch (error) {
      console.error('Error stopping preview:', error);
    }
  }
}

export const useAudioPlayer = () => {
  const playbackState = usePlaybackState();
  const { setPreviewState } = usePlayback();
  // Some versions of RNTP return an object with a 'state' property
  const state = (playbackState as any)?.state ?? playbackState;
  return {
    isPlaying: state === State.Playing,
    isLoading: state === State.Loading,
    play: (previewUrl: string, trackInfo: any) => AdvancedAudioService.playPreview(previewUrl, trackInfo, setPreviewState),
    stop: () => AdvancedAudioService.stopPreview(setPreviewState),
  };
};

// Fetch Deezer preview URL for a track
export const getTrackPreview = async (artist: string, title: string) => {
  try {
    const response = await fetch(
      `https://api.deezer.com/search/track?q=${encodeURIComponent(artist)}%20${encodeURIComponent(title)}`
    );
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].preview; // 30-second preview URL
    }
    return null;
  } catch (error) {
    console.error('Error fetching preview:', error);
    return null;
  }
}; 

// NOTE: Do NOT call AdvancedAudioService.initialize() anywhere except App.tsx root useEffect! 