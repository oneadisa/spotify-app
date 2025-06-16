export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Player: { id: string };
  Playlist: { id: string };
  Artist: { id: string };
};

export type HomeStackParamList = {
  Home: undefined;
  Playlist: { id: string };
  Artist: { id: string };
};

export type SearchStackParamList = {
  Search: undefined;
  Playlist: { id: string };
  Artist: { id: string };
};

export type LibraryStackParamList = {
  Library: undefined;
  Playlist: { id: string };
  Artist: { id: string };
};
