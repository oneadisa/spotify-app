import Toast from 'react-native-toast-message';

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 2500,
  });
} 