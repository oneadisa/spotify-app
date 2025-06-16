import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// This helps TypeScript understand the module types
declare module '@react-navigation/native' {
  export * from '@react-navigation/native';
}

declare module '@react-navigation/native-stack' {
  export * from '@react-navigation/native-stack';
}

declare module '@react-navigation/bottom-tabs' {
  export * from '@react-navigation/bottom-tabs';
}
