import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types.js';
import { MainTabs } from './MainTabs.tsx';
import { PlayerScreen } from '../screens/index.ts';
import LoginScreen from '../screens/Login/LoginScreen.tsx';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
