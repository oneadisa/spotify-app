import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LibraryStackParamList } from '../types.ts';
import { LibraryScreen, PlaylistScreen, ArtistScreen } from '../../screens/index.ts';
import PlayerScreen from '../../screens/ProfileScreen.tsx';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen 
        name="Playlist" 
        component={PlaylistScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen 
        name="Artist" 
        component={ArtistScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen 
        name="PlayerScreen" 
        component={PlayerScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LibraryStackNavigator;
