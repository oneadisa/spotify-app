import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import PhoneIcon from '../../components/icons/PhoneIcon.tsx';
import GoogleIcon from '../../components/icons/GoogleIcon.tsx';
import FacebookIcon from '../../components/icons/FacebookIcon.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types.js';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    // For now, just navigate to MainTabs
    // In a real app, you would handle authentication here
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/Spotify-Logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Headline */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>Millions of songs</Text>
        <Text style={styles.headline}>Free on Spotify.</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupText}>Sign up free</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <PhoneIcon size={20} color="#fff" style={styles.iconLeft} />
          <Text style={styles.outlineText}>Continue with phone number</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <GoogleIcon size={20} style={styles.iconLeft} />
          <Text style={styles.outlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <FacebookIcon size={20} style={styles.iconLeft} />
          <Text style={styles.outlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Login link */}
      <TouchableOpacity onPress={handleLogin} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 100,
  },
  textContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  headline: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  signupButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  signupText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 50,
  },
  iconLeft: {
    position: 'absolute',
    left: 16,
  },
  outlineText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
