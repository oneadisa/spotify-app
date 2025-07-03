import React, { createContext, useContext, useState, useCallback } from 'react';

type PlaylistContextType = {
  playlists: any[];
  loading: boolean;
  error: string | null;
  refreshPlaylists: (playlists: any[]) => void;
  updatePlaylist: (id: string, updates: Partial<any>) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPlaylists = useCallback((newPlaylists: any[]) => {
    setPlaylists(newPlaylists);
    setLoading(false);
    setError(null);
  }, []);

  const updatePlaylist = useCallback((id: string, updates: Partial<any>) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === id ? { ...playlist, ...updates } : playlist
      )
    );
  }, []);

  const addPlaylist = useCallback((playlist: any) => {
    setPlaylists(prev => [...prev, playlist]);
  }, []);

  const removePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
  }, []);

  return (
    <PlaylistContext.Provider 
      value={{
        playlists,
        loading,
        error,
        refreshPlaylists,
        updatePlaylist
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};
