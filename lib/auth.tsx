import { createContext, useContext, ReactNode, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { signIn as apiSignIn, verifyOtp as apiVerifyOtp } from './api';
import { tokenStorage, pinStorage, clearAuthStorage, storage } from './storage';

export type AuthState =
  | 'unauthenticated'
  | 'signing-in'
  | 'verifying-otp'
  | 'verifying-pin'
  | 'setting-pin'
  | 'change-pin'
  | 'authenticated';

interface AuthContextType {
  authState: AuthState;
  phone: string | null;
  token: string | null;
  hasPin: boolean;
  isInitialized: boolean;
  signIn: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  signOut: () => void;
  startChangePin: () => void;
  error: string | null;
}

const authStateAtom = atom<AuthState>('unauthenticated');
const phoneAtom = atom<string | null>(null);
const tokenAtom = atom<string | null>(null);
const pinAtom = atom<string | null>(null);
const hasPinAtom = atom<boolean>(false);
const errorAtom = atom<string | null>(null);
const isInitializedAtom = atom<boolean>(false);

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useAtom(authStateAtom);
  const [phone, setPhone] = useAtom(phoneAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [pin, setPin] = useAtom(pinAtom);
  const [hasPin, setHasPin] = useAtom(hasPinAtom);
  const [error, setError] = useAtom(errorAtom);
  const [isInitialized, setIsInitialized] = useAtom(isInitializedAtom);

  // Initialize from storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Check for stored token
      const storedToken = tokenStorage.getToken();
      const storedHasPin = pinStorage.hasPin();
      const storedPin = pinStorage.get();

      if (storedToken && storedHasPin) {
        // Token exists and has PIN - check if valid
        // User needs to verify PIN to access
        setToken(storedToken);
        setHasPin(storedHasPin);
        setPin(storedPin);
        setAuthState('authenticated');
      } else if (storedToken && !storedHasPin) {
        // Token exists but no PIN - needs to set PIN
        setToken(storedToken);
        setHasPin(false);
        setAuthState('setting-pin');
      } else if (!storedToken && storedHasPin) {
        setHasPin(storedHasPin);
        setPin(storedPin);
        setAuthState('verifying-pin');
      } else {
        setAuthState('unauthenticated');
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const signIn = async (phoneNumber: string) => {
    setError(null);
    setAuthState('signing-in');
    setPhone(phoneNumber);

    try {
      const response = await apiSignIn(phoneNumber);
      // Store token with expiry
      if (response.data?.token) {
        setToken(response.data?.token);
      }

      if (hasPin) {
        setAuthState('verifying-pin');
      } else {
        setAuthState('verifying-otp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setAuthState('unauthenticated');
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (!phone) return false;

    setError(null);
    setAuthState('verifying-otp');

    try {
      await apiVerifyOtp(phone, otp);

      // Check if user has PIN set - if not, go to set-pin
      if (!hasPin) {
        setAuthState('setting-pin');
      } else {
        setAuthState('authenticated');
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
      setAuthState('verifying-otp');
      return false;
    }
  };

  const setPinHandler = async (pinCode: string): Promise<boolean> => {
    setError(null);
    pinStorage.set(pinCode);
    tokenStorage.setToken(token as string, 3600);
    setPin(pinCode);
    setHasPin(true);
    setAuthState('authenticated');
    return true;
  };

  const verifyPinHandler = async (pinCode: string): Promise<boolean> => {
    setError(null);
    if (pinCode === pin) {
      tokenStorage.setToken(token as string, 3600);
      setAuthState('authenticated');
      return true;
    }
    setError('Invalid PIN');
    return false;
  };

  const startChangePin = async () => {
    setAuthState('change-pin');
  };

  const signOut = () => {
    setAuthState('unauthenticated');
    setPhone(null);
    setToken(null);
    setError(null);
    // Clear storage
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        phone,
        token,
        hasPin,
        isInitialized,
        signIn,
        verifyOtp,
        setPin: setPinHandler,
        verifyPin: verifyPinHandler,
        startChangePin,
        signOut,
        error,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Selector atoms for convenient access
export const useAuthState = () => useAtom(authStateAtom);
export const useToken = () => useAtom(tokenAtom);
export const usePhone = () => useAtom(phoneAtom);
export const useAuthError = () => useAtom(errorAtom);
export const useHasPin = () => useAtom(hasPinAtom);
export const useIsInitialized = () => useAtom(isInitializedAtom);
