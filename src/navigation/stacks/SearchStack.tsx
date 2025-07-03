import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types.ts';
import { SearchScreen, PlaylistScreen, ArtistScreen } from '../../screens/index.ts';
import NowPlayingScreen from '../../screens/NowPlayingScreen.tsx';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen 
        name="Playlist" 
        component={PlaylistScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Artist" 
        component={ArtistScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PlayerScreen" 
        component={NowPlayingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
