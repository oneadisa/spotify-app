import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/index.ts';
import HomeIcon from '../components/icons/HomeIcon.tsx';
import HomeOutlineIcon from '../components/icons/HomeOutlineIcon.tsx';
import SearchIcon from '../components/icons/SearchIcon.tsx';
import SearchOutlineIcon from '../components/icons/SearchOutlineIcon.tsx';
import LibraryIcon from '../components/icons/LibraryIcon.tsx';
import LibraryOutlineIcon from '../components/icons/LibraryOutlineIcon.tsx';
import { HomeStackNavigator, SearchStackNavigator, LibraryStackNavigator } from './stacks/index.ts';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          const renderTabBarIcon = (routeName: string, focused: boolean) => {
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
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStackNavigator} 
        options={{ title: 'Search' }} 
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryStackNavigator} 
        options={{ title: 'Library' }} 
      />
    </Tab.Navigator>
  );
};

// MainTabs is exported as a named export
