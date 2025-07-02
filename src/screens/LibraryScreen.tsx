import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper.tsx';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import NowPlayingBar from '../components/playlist/NowPlayingBar/NowPlayingBar.tsx';
import { showToast } from '../utils/toast';

const { height } = Dimensions.get('window');

const LibraryScreen = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Library'>>();
  const { themePreference, setThemePreference } = useTheme();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out', 'success');
    navigation.replace('Login'); // Assumes 'Login' is the AuthScreen route name
  };

  // Cycle through theme preferences
  const handleThemeToggle = async () => {
    const next = themePreference === 'light' ? 'dark' : themePreference === 'dark' ? 'system' : 'light';
    await setThemePreference(next);
    showToast(`Theme set to ${next}`, 'info');
  };

  return (
    <>
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Your Library
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.themeButton} onPress={handleThemeToggle}>
                <Text style={styles.themeButtonText}>
                  {themePreference === 'light' ? '☀️' : themePreference === 'dark' ? '🌙' : '🖥️'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Library Empty for now</Text>
          </View>
        </View>
      </ScreenWrapper>
      <NowPlayingBar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Adjust this value to center the text vertically
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#1DB954',
    borderRadius: 20,
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#222',
    borderRadius: 20,
    marginRight: 8,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LibraryScreen;
