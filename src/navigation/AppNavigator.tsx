import React, { useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../contexts/AuthContext';

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Create a navigation reference to enable navigation outside of components
const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

interface AppNavigatorProps {
  isAuthenticated: boolean;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ isAuthenticated }) => {
  // Handle navigation based on authentication state
  useEffect(() => {
    if (navigationRef.current) {
      if (isAuthenticated) {
        // If authenticated, navigate to MainTabs and clear the navigation stack
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        // If not authenticated, navigate to Login and clear the navigation stack
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <RootStack.Screen name="Login" component={AuthScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
