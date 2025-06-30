# Spotify Authentication Setup

## Prerequisites

1. Create a Spotify Developer account at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application in the dashboard
3. Note down your Client ID and Client Secret

## Configuration

1. Open `src/config/spotify.ts`
2. Replace the following placeholders with your Spotify app credentials:
   ```typescript
   export const SPOTIFY_CONFIG = {
     clientId: 'YOUR_SPOTIFY_CLIENT_ID',
     clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET', // For server-side auth if needed
     redirectUri: 'exp://localhost:19000/--/spotify-auth',
     // ... rest of the config
   };
   ```

## Setting Up Redirect URI

1. Go to your Spotify Developer Dashboard
2. Select your app
3. Click on "Edit Settings"
4. Add the following to "Redirect URIs":
   - `exp://localhost:19000/--/spotify-auth` (for development)
   - `your-app-scheme://spotify-auth` (for production, replace with your app's scheme)
5. Save the changes

## Environment Variables (Optional but Recommended)

For better security, you can use environment variables. Create a `.env` file in the root of your project:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Then update `src/config/spotify.ts` to use these variables:

```typescript
import Constants from 'expo-constants';

export const SPOTIFY_CONFIG = {
  clientId: Constants.expoConfig?.extra?.spotifyClientId || 'YOUR_SPOTIFY_CLIENT_ID',
  clientSecret: Constants.expoConfig?.extra?.spotifyClientSecret || 'YOUR_SPOTIFY_CLIENT_SECRET',
  // ... rest of the config
};
```

## Testing the Authentication

1. Start your Expo development server:
   ```bash
   npx expo start
   ```
2. Scan the QR code with your device using the Expo Go app
3. On the login screen, tap "Continue with Spotify"
4. You should be redirected to the Spotify login page
5. After logging in, you'll be redirected back to the app

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure the redirect URI in your code matches exactly with the one in your Spotify Dashboard.

2. **Invalid Client ID/Secret**: Double-check your client ID and secret.

3. **CORS Errors**: If you see CORS errors, ensure you're using the correct redirect URI format and that it's properly configured in your Spotify Dashboard.

4. **Expo Go Limitations**: Deep linking in Expo Go has some limitations. For production, you'll need to create a development build or use a custom development client.

### Debugging

- Check the console logs in your development environment for any error messages.
- Use React Native Debugger or React DevTools to inspect the authentication state.
- Verify that the tokens are being stored correctly in SecureStore.

## Next Steps

1. Implement token refresh logic (partially implemented in `useSpotifyAuth`)
2. Set up API calls to Spotify Web API using the access token
3. Handle token expiration and refresh automatically
4. Implement proper error handling and user feedback

## Security Considerations

- Never expose your client secret in client-side code in production
- Use environment variables or a backend service for sensitive credentials
- Implement proper token storage and handling
- Use PKCE for enhanced security (already implemented in the code)
