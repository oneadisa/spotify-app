import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types.ts';
import { SearchScreen, PlaylistScreen, ArtistScreen } from '../../screens/index.ts';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
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
          headerBackVisible: false, // Hide the default back button
          headerLeft: () => null, // Remove the back button completely
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
