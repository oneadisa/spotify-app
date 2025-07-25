import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useAuth } from "../contexts/AuthContext";
import PhoneIcon from "../components/icons/PhoneIcon";
import GoogleIcon from "../components/icons/GoogleIcon";
import FacebookIcon from "../components/icons/FacebookIcon";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const AuthScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const { login, isAuthenticated, isLoading, error } = useAuth();

  const isLoggingIn = isLoading;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    console.log('AuthScreen: isAuthenticated changed to:', isAuthenticated);
    if (isAuthenticated) {
      console.log('AuthScreen: Navigating to MainTabs');
      navigation.replace("MainTabs");
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Authentication Error", 
        error, 
        error.includes("network") 
          ? [
              { text: "OK", style: "default" },
              { text: "Retry", style: "default", onPress: () => login() }
            ]
          : [{ text: "OK", style: "default" }]
      );
    }
  }, [error, login]);

  const handleSpotifyLogin = useCallback(() => {
    login();
  }, [login]);

  const handleContinueWithoutAccount = useCallback(() => {
    Alert.alert(
      "Limited Features",
      "You can still browse, but features like playing music, saving tracks, and accessing your playlists will be unavailable without logging in.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "default",
          onPress: () => navigation.replace("MainTabs"),
        },
      ]
    );
  }, [navigation]);

  const animateButtonPress = useCallback(
    (toValue: number) => {
      Animated.spring(buttonScale, {
        toValue,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    },
    [buttonScale]
  );

  const handlePressIn = useCallback(() => {
    if (!isLoggingIn) animateButtonPress(0.95);
  }, [animateButtonPress, isLoggingIn]);

  const handlePressOut = useCallback(() => {
    if (!isLoggingIn) animateButtonPress(1);
  }, [animateButtonPress, isLoggingIn]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const buttonAnimatedStyle = {
    transform: [{ scale: buttonScale }],
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
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
      color: theme.colors.text,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: 34,
    },
    buttonsContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    signupButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 25,
      paddingVertical: 12,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      justifyContent: "center",
    },
    signupText: {
      color: theme.colors.buttonText,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    outlineButton: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.text,
      borderWidth: 1,
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
      height: 50,
    },
    iconLeft: {
      position: "absolute",
      left: 16,
    },
    outlineText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
    },
    loginLink: {
      marginTop: 20,
    },
    loginLinkText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: 10,
      fontSize: 16,
    },
    disabledButton: {
      opacity: 0.7,
    },
  });

  if (isLoggingIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Connecting to Spotify...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

      <Animated.View
        style={[
          {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 40,
          },
          animatedStyle,
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/Spotify-Logo.png")}
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
          <TouchableOpacity
            style={[styles.signupButton, isLoggingIn && styles.disabledButton]}
            disabled={isLoggingIn}
            onPress={handleContinueWithoutAccount}
          >
            <Text style={styles.signupText}>Sign up free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, isLoggingIn && styles.disabledButton]}
            disabled={isLoggingIn}
          >
            <PhoneIcon size={20} color={theme.colors.text} style={styles.iconLeft} />
            <Text style={styles.outlineText}>Continue with phone number</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, isLoggingIn && styles.disabledButton]}
            disabled={isLoggingIn}
          >
            <GoogleIcon size={20} style={styles.iconLeft} />
            <Text style={styles.outlineText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, isLoggingIn && styles.disabledButton]}
            disabled={isLoggingIn}
          >
            <FacebookIcon size={20} style={styles.iconLeft} />
            <Text style={styles.outlineText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.outlineButton,
                isLoggingIn && styles.disabledButton,
              ]}
              onPress={handleSpotifyLogin}
              disabled={isLoggingIn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Log in with Spotify"
            >
              {isLoggingIn ? (
                <ActivityIndicator color={theme.colors.text} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="musical-notes"
                    size={20}
                    color={theme.colors.text}
                    style={styles.iconLeft}
                  />
                  <Text style={styles.outlineText}>Log in</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AuthScreen;
