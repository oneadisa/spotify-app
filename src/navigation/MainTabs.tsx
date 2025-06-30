import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import HomeIcon from '../components/icons/HomeIcon';
import HomeOutlineIcon from '../components/icons/HomeOutlineIcon';
import SearchIcon from '../components/icons/SearchIcon';
import SearchOutlineIcon from '../components/icons/SearchOutlineIcon';
import LibraryIcon from '../components/icons/LibraryIcon';
import LibraryOutlineIcon from '../components/icons/LibraryOutlineIcon';
import { HomeStackNavigator } from './stacks/HomeStack';
import { SearchStackNavigator } from './stacks/SearchStack';
import { LibraryStackNavigator } from './stacks/LibraryStack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { HomeStackParamList, SearchStackParamList, LibraryStackParamList } from './types';

export type MainTabsParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  LibraryTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const renderTabBarIcon = (routeName: keyof MainTabsParamList, focused: boolean) => {
            const baseIconProps = { size: 24 };
            const inactiveColor = theme.colors.textSecondary;
            const activeColor = routeName === 'LibraryTab' ? '#fff' : theme.colors.primary;
            const iconColor = focused ? activeColor : inactiveColor;
            const iconProps = { ...baseIconProps, color: iconColor };

            switch (routeName) {
              case 'HomeTab':
                return focused ? <HomeIcon {...iconProps} /> : <HomeOutlineIcon {...iconProps} />;
              case 'SearchTab':
                return focused ? <SearchIcon {...iconProps} /> : <SearchOutlineIcon {...iconProps} />;
              case 'LibraryTab':
                return focused ? <LibraryIcon color="#fff" size={24} /> : <LibraryOutlineIcon {...iconProps} />;
              default:
                return <HomeOutlineIcon {...iconProps} />;
            }
          };

          return renderTabBarIcon(route.name, focused);
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#282828',
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ 
          title: 'Home',
          // @ts-ignore - testID is a valid prop for testing
          tabBarTestID: 'home-tab',
        }} 
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStackNavigator} 
        options={{ 
          title: 'Search',
          // @ts-ignore - testID is a valid prop for testing
          tabBarTestID: 'search-tab',
        }} 
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryStackNavigator}
        options={{
          title: 'Your Library',
          // @ts-ignore - testID is a valid prop for testing
          tabBarTestID: 'library-tab',
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#282828',
            borderTopWidth: 1,
          },
        }}
      />
    </Tab.Navigator>
  );
};

// MainTabs is exported as a named export
