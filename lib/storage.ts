import { createMMKV } from 'react-native-mmkv';

// Use any to bypass type issues with MMKV v4
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storage: any = createMMKV({
  id: 'salary-hero-storage',
});

// Storage keys
export const StorageKeys = {
  TOKEN: 'auth.token',
  TOKEN_EXPIRY: 'auth.tokenExpiry',
  PHONE: 'auth.phone',
  PIN: 'auth.pin',
  HAS_PIN: 'auth.hasPin',
} as const;

// Token management
export const tokenStorage = {
  setToken: (token: string, expiresInSeconds: number = 3600) => {
    const expiry = Date.now() + expiresInSeconds * 1000;
    storage.set(StorageKeys.TOKEN, token);
    storage.set(StorageKeys.TOKEN_EXPIRY, expiry);
  },

  getToken: (): string | null => {
    const token = storage.getString(StorageKeys.TOKEN);
    const expiry = storage.getNumber(StorageKeys.TOKEN_EXPIRY);

    if (!token || !expiry) return null;

    // Check if token is expired
    if (Date.now() >= expiry) {
      // Clear expired token
      storage.remove(StorageKeys.TOKEN);
      storage.remove(StorageKeys.TOKEN_EXPIRY);
      return null;
    }

    return token;
  },

  clearToken: () => {
    storage.remove(StorageKeys.TOKEN);
    storage.remove(StorageKeys.TOKEN_EXPIRY);
  },

  isTokenValid: (): boolean => {
    const token = storage.getString(StorageKeys.TOKEN);
    const expiry = storage.getNumber(StorageKeys.TOKEN_EXPIRY);

    if (!token || !expiry) return false;
    return Date.now() < expiry;
  },
};

// Phone storage
export const phoneStorage = {
  set: (phone: string) => {
    storage.set(StorageKeys.PHONE, phone);
  },
  get: (): string | null => {
    return storage.getString(StorageKeys.PHONE) ?? null;
  },
  clear: () => {
    storage.remove(StorageKeys.PHONE);
  },
};

// PIN storage
export const pinStorage = {
  set: (pin: string) => {
    storage.set(StorageKeys.PIN, pin);
    storage.set(StorageKeys.HAS_PIN, true);
  },
  get: (): string | null => {
    return storage.getString(StorageKeys.PIN) ?? null;
  },
  hasPin: (): boolean => {
    return storage.getBoolean(StorageKeys.HAS_PIN) ?? false;
  },
  clear: () => {
    storage.remove(StorageKeys.PIN);
    storage.remove(StorageKeys.HAS_PIN);
  },
};

// Clear all auth data
export const clearAuthStorage = () => {
  tokenStorage.clearToken();
  phoneStorage.clear();
};
