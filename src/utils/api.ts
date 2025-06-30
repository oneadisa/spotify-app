import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../config/spotify';

type HeadersInit = Headers | string[][] | Record<string, string>;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions {
  method?: RequestMethod;
  body?: Record<string, any> | FormData | null;
  headers?: Record<string, string>;
  authRequired?: boolean;
  jsonResponse?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body = null,
    headers = {},
    authRequired = true,
    jsonResponse = true,
  } = options;

  // Prepare request headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if required
  if (authRequired) {
    const accessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw new Error('No access token available');
    }
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  // Prepare request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body if provided
  if (body) {
    if (body instanceof FormData) {
      // If it's FormData, let the browser set the Content-Type header with boundary
      delete requestHeaders['Content-Type'];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(endpoint, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      
      throw new ApiError(
        errorData.error?.message || 'Something went wrong',
        response.status,
        errorData
      );
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response if expected
    if (jsonResponse) {
      return await response.json();
    }

    // Return as text for non-JSON responses
    return (await response.text()) as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      // Re-throw API errors
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError('Network error. Please check your connection.', 0);
    }
    
    // Unknown error
    throw new ApiError('An unexpected error occurred', 0, { error });
  }
}

// Helper function to show error alerts to the user
export function showErrorAlert(error: unknown, defaultMessage = 'An error occurred') {
  let message = defaultMessage;
  
  if (error instanceof ApiError) {
    message = error.message || defaultMessage;
    
    // Handle specific error statuses
    if (error.status === 401) {
      message = 'Your session has expired. Please log in again.';
      // TODO: Trigger logout
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  Alert.alert('Error', message);
}

// Helper function to handle API calls with loading and error states
export async function withApiHandler<T>(
  apiCall: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    errorMessage?: string;
  } = {}
): Promise<T | undefined> {
  try {
    const data = await apiCall();
    if (options.onSuccess) {
      options.onSuccess(data);
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Show error to user
    showErrorAlert(error, options.errorMessage);
    
    // Call error handler if provided
    if (options.onError) {
      options.onError(error);
    }
    
    return undefined;
  }
}
