# React Native Spotify Playlist App - Complete Requirements & Implementation Guide

## 🎯 Project Overview
Build a fully functional React Native Spotify playlist app that maximizes scoring across all 5 grading categories (25 points total + 5 bonus points).

## 📋 Core Requirements (25 Points)

### ✅ Functionality (5 Points)
**Must implement ALL features flawlessly:**
- Spotify OAuth login with proper token management
- Search functionality with real-time results
- Playlist creation on user's Spotify account
- Add/remove tracks from playlists
- Error handling for all API calls
- Loading states for all async operations

### 🎨 UI/UX (5 Points)
**Design Requirements:**
- Clean, modern interface following React Native best practices
- Responsive design that works on different screen sizes
- Intuitive navigation (Tab navigation + Stack navigation)
- Consistent color scheme and typography
- Loading indicators and empty states
- Toast notifications for user feedback
- Dark theme support (bonus feature)

### 💻 Code Quality (5 Points)
**Technical Excellence:**
- Modular component architecture
- Custom hooks for API calls and state management
- TypeScript for type safety
- Proper error boundaries
- Clean, well-commented code
- Consistent naming conventions
- Separation of concerns (services, components, hooks)

### 🔐 API Integration (5 Points)
**Spotify API Implementation:**
- Secure OAuth 2.0 flow with PKCE
- Proper token refresh handling
- Rate limiting awareness
- Comprehensive error handling for all API endpoints
- Secure token storage

### 🎤 Presentation (5 Points)
**Demo Requirements:**
- Live app demonstration (3-4 minutes)
- Explanation of key technical decisions
- Discussion of challenges overcome
- Showcase of bonus features

## 🚀 Bonus Features (Up to +5 Points)
Implement as many as possible:
- **Theme Toggle**: Light/Dark mode switching
- **Animations**: Smooth transitions and micro-interactions
- **Profile Screen**: User profile with stats
- **Collaborative Playlists**: Share playlist creation
- **Track Preview**: 30-second audio previews using Deezer API (CRITICAL - see audio solution below)
- **Recently Played**: Show user's recent tracks
- **Playlist Management**: Edit existing playlists

## 🛠 Technical Stack & Setup

### Required Dependencies

#### **Option A: Simple Audio (Expo AV)**
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "expo": "~49.0.0",
    "expo-auth-session": "~5.0.0",
    "expo-crypto": "~12.4.0",
    "expo-web-browser": "~12.3.0",
    "expo-av": "~13.4.0",
    "expo-secure-store": "~12.3.0",
    "react": "18.2.0",
    "react-native": "0.72.x",
    "react-native-safe-area-context": "4.6.x",
    "react-native-screens": "~3.22.0",
    "axios": "^1.4.0",
    "@react-native-async-storage/async-storage": "1.18.x",
    "react-native-toast-message": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.72.0",
    "typescript": "^5.1.0"
  }
}
```

#### **Option B: Advanced Audio (RNTP)**
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "expo": "~49.0.0",
    "expo-auth-session": "~5.0.0",
    "expo-crypto": "~12.4.0",
    "expo-web-browser": "~12.3.0",
    "expo-secure-store": "~12.3.0",
    "react": "18.2.0",
    "react-native": "0.72.x",
    "react-native-safe-area-context": "4.6.x",
    "react-native-screens": "~3.22.0",
    "axios": "^1.4.0",
    "@react-native-async-storage/async-storage": "1.18.x",
    "react-native-toast-message": "^2.1.0",
    "react-native-track-player": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.72.0",
    "typescript": "^5.1.0"
  }
}
```

**Note**: Option B requires additional native module setup (pod install for iOS)

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   └── Toast.tsx
│   ├── track/
│   │   ├── TrackCard.tsx
│   │   ├── TrackList.tsx
│   │   └── TrackSearch.tsx
│   └── playlist/
│       ├── PlaylistForm.tsx
│       └── PlaylistCard.tsx
├── screens/
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── PlaylistScreen.tsx
│   └── ProfileScreen.tsx
├── services/
│   ├── spotifyApi.ts
│   ├── deezerApi.ts
│   ├── authService.ts
│   ├── audioService.ts
│   └── storageService.ts
├── hooks/
│   ├── useSpotifyAuth.ts
│   ├── useSpotifyApi.ts
│   └── useTheme.ts
├── types/
│   └── spotify.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
└── context/
    ├── AuthContext.tsx
    └── ThemeContext.tsx
```

## 🔄 Implementation Phases

### Phase 1: Core Setup (Day 1 Morning - 3 hours)
1. **Project Initialization**
   - Create Expo project with TypeScript
   - Install all dependencies
   - Set up navigation structure
   - Configure Spotify App in Developer Dashboard

2. **Authentication Implementation**
   - Implement OAuth 2.0 with PKCE flow
   - Create secure token storage
   - Build login/logout functionality
   - Add token refresh logic

### Phase 2: Core Features (Day 1 Afternoon - 4 hours)
1. **Search Functionality**
   - Implement debounced search
   - Create track display components
   - Add search results handling

2. **Playlist Management**
   - Build playlist creation UI
   - Implement Spotify playlist creation API
   - Add tracks to playlist functionality
   - Remove tracks from playlist

### Phase 3: UI/UX Polish (Day 1 Evening - 2 hours)
1. **Design System**
   - Implement consistent styling
   - Add loading states
   - Create toast notifications
   - Ensure responsive design

### Phase 4: Bonus Features (Day 2 Morning - 3 hours)
1. **Advanced Features**
   - Theme toggle implementation
   - **CRITICAL**: Implement Deezer API integration for track previews
   - Choose audio implementation approach:
     - **Option A**: Simple Expo AV player (1-2 hours)
     - **Option B**: Advanced RNTP setup (2-3 hours)
   - Profile screen with user data
   - Smooth animations

### Audio Preview Implementation Options:

#### **Option A: Simple Implementation (Expo AV)**
```typescript
// services/audioService.ts - Simple Approach
import { Audio } from 'expo-av';

export class SimpleAudioService {
  private sound: Audio.Sound | null = null;

  async playPreview(previewUrl: string) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true, isLooping: false }
      );
      
      this.sound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  }

  async stopPreview() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

// Get Deezer preview URL
export const getTrackPreview = async (artist: string, title: string) => {
  try {
    const response = await fetch(
      `https://api.deezer.com/search/track?q=${encodeURIComponent(artist)} ${encodeURIComponent(title)}`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].preview; // 30-second preview URL
    }
    return null;
  } catch (error) {
    console.error('Error fetching preview:', error);
    return null;
  }
};
```

#### **Option B: Advanced Implementation (RNTP)**
```typescript
// services/audioService.ts - Advanced Approach
import TrackPlayer, { 
  Capability, 
  State,
  Event,
  usePlaybackState 
} from 'react-native-track-player';

export class AdvancedAudioService {
  static async initialize() {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
      });
    } catch (error) {
      console.error('Error initializing TrackPlayer:', error);
    }
  }

  static async playPreview(previewUrl: string, trackInfo: any) {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: trackInfo.id,
        url: previewUrl,
        title: trackInfo.title,
        artist: trackInfo.artist,
        duration: 30, // 30-second preview
        artwork: trackInfo.artwork || undefined,
      });
      
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  }

  static async stopPreview() {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error stopping preview:', error);
    }
  }
}

// Component usage with RNTP
export const useAudioPlayer = () => {
  const playbackState = usePlaybackState();
  
  return {
    isPlaying: playbackState === State.Playing,
    isLoading: playbackState === State.Loading,
    play: AdvancedAudioService.playPreview,
    stop: AdvancedAudioService.stopPreview,
  };
};
```

### **Option Selection Guide:**
- **Choose Option A** if: Limited time, want guaranteed working solution
- **Choose Option B** if: Want to showcase advanced skills, have extra time for debugging

### Phase 5: Testing & Polish (Day 2 Afternoon - 3 hours)
1. **Quality Assurance**
   - Test all functionality thoroughly
   - Fix any bugs or edge cases
   - Optimize performance
   - Prepare presentation demo

## 🔧 Critical Implementation Details

### 🎵 AUDIO PREVIEW SOLUTION (CRITICAL)
**Problem**: Spotify preview URLs are deprecated/unreliable
**Solution**: Choose between two approaches based on your complexity preference

#### **Option A: Simple Approach (Recommended for 2-day timeline)**
```typescript
// Deezer API + Expo AV (Simpler, faster implementation)
const DEEZER_CONFIG = {
  baseUrl: 'https://api.deezer.com',
  // No auth required for search and previews
};

// Use Expo AV for basic audio playback
import { Audio } from 'expo-av';
```

#### **Option B: Advanced Approach (For bonus complexity points)**
```typescript
// Deezer API + React Native Track Player (Advanced features)
const DEEZER_CONFIG = {
  baseUrl: 'https://api.deezer.com',
};

// Use RNTP for professional audio playback
import TrackPlayer from 'react-native-track-player';
```

#### **Spotify Configuration (Both Options)**
```typescript
const SPOTIFY_CONFIG = {
  clientId: 'your_client_id',
  redirectUri: 'exp://localhost:19000/--/spotify-auth',
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-top-read'
  ]
};
```

### Key API Endpoints to Implement

#### Spotify APIs (Authentication & Playlist Management)
- `GET /me` - User profile
- `GET /search` - Search tracks/artists (for metadata)
- `POST /users/{user_id}/playlists` - Create playlist
- `POST /playlists/{playlist_id}/tracks` - Add tracks
- `DELETE /playlists/{playlist_id}/tracks` - Remove tracks
- `GET /me/playlists` - User playlists

#### Deezer APIs (Track Previews)
- `GET /search/track?q={artist} {title}` - Find matching tracks
- Track objects include `preview` field with 30s audio URL

### Error Handling Strategy
```typescript
// Implement comprehensive error handling
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired, refresh or re-authenticate
  } else if (error.response?.status === 429) {
    // Rate limited, implement retry logic
  } else {
    // Show user-friendly error message
  }
};
```

## 📱 UI/UX Requirements

### Color Scheme
```typescript
const theme = {
  colors: {
    primary: '#1DB954', // Spotify Green
    secondary: '#191414', // Spotify Black
    background: '#121212',
    surface: '#282828',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    error: '#E22134'
  }
};
```

### Navigation Structure
```
Bottom Tabs:
├── Home (Featured/Recent)
├── Search
├── Library (Playlists)
└── Profile

Stack Navigation within each tab as needed
```

## ✅ Testing Checklist

### Functionality Tests
- [ ] Login with Spotify works
- [ ] Search returns relevant results
- [ ] Can create new playlists
- [ ] Can add tracks to playlists
- [ ] Can remove tracks from playlists
- [ ] Error states handled gracefully
- [ ] Loading states shown appropriately

### UI/UX Tests
- [ ] App works on different screen sizes
- [ ] Navigation is intuitive
- [ ] Visual feedback for all actions
- [ ] Consistent styling throughout
- [ ] Dark theme works properly (if implemented)

### Code Quality Checks
- [ ] Components are modular and reusable
- [ ] TypeScript types are properly defined
- [ ] Code is well-commented
- [ ] No console.log statements in production
- [ ] Proper error boundaries implemented

## 🎯 Scoring Optimization Strategy

### Maximum Points Strategy:
1. **Functionality (5/5)**: Implement all core features with robust error handling
2. **UI/UX (5/5)**: Focus on clean, responsive design with excellent UX
3. **Code Quality (5/5)**: Use TypeScript, modular architecture, and clean code
4. **API Integration (5/5)**: Secure, proper Spotify API implementation
5. **Presentation (5/5)**: Smooth demo with technical explanation
6. **Bonus (+5)**: Implement theme toggle, animations, and track preview

### Risk Mitigation:
- Test on both iOS and Android simulators
- Have fallback UI for API failures
- Implement offline state handling
- Prepare backup demo video

## 📋 Presentation Preparation

### Demo Script (3-4 minutes):
1. **Opening (30s)**: App overview and key features
2. **Authentication (30s)**: Show Spotify login flow
3. **Core Features (2m)**: Search, playlist creation, track management
4. **Bonus Features (30s)**: Theme toggle, animations, preview
5. **Technical Discussion (30s)**: Key challenges and solutions

### Key Technical Points to Mention:
- OAuth 2.0 with PKCE implementation
- Debounced search optimization
- Modular component architecture
- Error handling strategy
- Responsive design approach

## 🚨 Critical Success Factors

1. **Start with Authentication**: Get Spotify login working first
2. **Choose Audio Strategy Early**: Pick Option A or B based on your timeline and complexity preference
3. **Implement Audio Solution Early**: Set up Deezer API integration on Day 1
4. **Incremental Development**: Build and test each feature completely
5. **Error Handling**: Implement robust error handling from the start
6. **User Feedback**: Always show loading states and success/error messages
7. **Code Organization**: Keep code clean and modular for easy debugging
8. **Testing**: Test frequently on device/simulator during development

### **Audio Implementation Decision Matrix:**

| Factor | Option A (Expo AV) | Option B (RNTP) |
|--------|-------------------|-----------------|
| **Setup Time** | 30 minutes | 1-2 hours |
| **Implementation** | Simple | Complex |
| **Features** | Basic play/pause | Advanced controls |
| **Debugging** | Easy | Can be tricky |
| **Bonus Points** | +2 points | +4 points |
| **Risk Level** | Low | Medium |
| **Best for** | 2-day timeline | Showcase skills |

### **Recommendation by Timeline:**
- **Tight 2-day schedule**: Use Option A
- **Comfortable with extra time**: Use Option B for maximum points
- **Unsure**: Start with Option A, upgrade to Option B if time permits

## 🎯 Final Deliverables

1. **Functional App**: Working React Native app with all core features
2. **Source Code**: Clean, well-organized TypeScript codebase
3. **Demo Video**: 3-4 minute presentation showcasing features
4. **Technical Documentation**: Brief explanation of architecture decisions

This requirements document provides everything needed to build a maximum-scoring Spotify playlist app in 2 days. Focus on implementing features incrementally and testing thoroughly at each step.