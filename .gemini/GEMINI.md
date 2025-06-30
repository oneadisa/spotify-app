# Spotify Playlist App Project Summary

This document summarizes the key requirements and technical specifications for building the Spotify Playlist App.

## 🎯 Project Overview
The goal is to build a fully functional React Native Spotify playlist app.

## ✅ Core Requirements
- Spotify OAuth login with token management
- Search functionality with real-time results
- Playlist creation on the user's Spotify account
- Add/remove tracks from playlists
- Error handling for all API calls
- Loading states for all async operations
- Clean, modern, and responsive UI
- Intuitive navigation (Tabs and Stacks)
- Consistent color scheme and typography

## 🚀 Bonus Features
- Light/Dark mode theme toggle
- Animations and micro-interactions
- User profile screen with stats
- Collaborative playlists
- 30-second track previews using Deezer API
- Recently played tracks
- Playlist management (editing existing playlists)

## 🛠 Technical Stack
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (Tabs and Stacks)
- **API Calls:** Axios
- **State Management:** React Hooks and Context API
- **Secure Storage:** expo-secure-store
- **Audio:** Expo AV or `react-native-track-player`

## 🎨 UI/UX
### Color Scheme
- **Primary:** `#1DB954` (Spotify Green)
- **Secondary:** `#191414` (Spotify Black)
- **Background:** `#121212`
- **Surface:** `#282828`
- **Text:** `#FFFFFF`
- **Text Secondary:** `#B3B3B3`
- **Error:** `#E22134`

### Navigation Structure
- **Bottom Tabs:** Home, Search, Library, Profile
- **Stack Navigation:** Used within each tab for deeper navigation.

## API Endpoints
### Spotify
- `GET /me`
- `GET /search`
- `POST /users/{user_id}/playlists`
- `POST /playlists/{playlist_id}/tracks`
- `DELETE /playlists/{playlist_id}/tracks`
- `GET /me/playlists`

### Deezer (for audio previews)
- `GET /search/track?q={artist} {title}`
