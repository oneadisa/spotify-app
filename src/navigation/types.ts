// Root stack navigation types
export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  
  // Main app screens
  MainTabs: undefined;
  
  // Shared screens
  Playlist: { id: string; name?: string };
  Artist: { id: string; name?: string };
  Album: { id: string; name?: string };
  
  // Other screens that might be needed
  Settings: undefined;
  Profile: { userId?: string };
  Search: undefined;
  SearchResults: { query: string };
  Library: undefined;
};

// Home tab navigation types
export type HomeStackParamList = {
  Home: undefined;
  Playlist: { id: string; name?: string };
  Artist: { id: string; name?: string };
  Album: { id: string; name?: string };
};

// Search tab navigation types
export type SearchStackParamList = {
  Search: undefined;
  SearchResults: { query: string };
  Playlist: { id: string; name?: string };
  Artist: { id: string; name?: string };
  Album: { id: string; name?: string };
  Category: { id: string; name: string };
};

// Library tab navigation types
export type LibraryStackParamList = {
  Library: undefined;
  Playlist: { id: string; name?: string };
  Artist: { id: string; name?: string };
  Album: { id: string; name?: string };
  LikedSongs: undefined;
  RecentlyPlayed: undefined;
  MadeForYou: undefined;
  Podcasts: undefined;
};
