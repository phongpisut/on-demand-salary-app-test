import '@/global.css';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';
import { AuthProvider, useAuth, useIsInitialized } from '@/lib/auth';

export { ErrorBoundary } from 'expo-router';

// Auth-aware navigation component
function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { authState } = useAuth();
  const [isInitialized] = useIsInitialized();

  const isAuthenticated = authState === 'authenticated';
  const isSettingPin = authState === 'setting-pin';
  const isVerifyingPin = authState === 'verifying-pin';
  const isChangePin = authState === 'change-pin';
  const isAuthRoute = ['/otp', '/verify-pin', '/set-pin', '/sign-in', '/passcode'].includes(
    pathname
  );

  useEffect(() => {
    // Don't redirect until auth is initialized
    if (!isInitialized) return;

    const r = router as any;

    // Redirect to sign-in if not authenticated

    if (!isAuthenticated && !isAuthRoute && !isChangePin) {
      r.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated, isAuthRoute, pathname, isInitialized]);

  const { theme } = useUniwind();
  const currentTheme = (theme ?? 'light') as 'light' | 'dark';

  // Show loading while initializing
  if (!isInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style={'light'} />
      <PortalHost />
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated || !isSettingPin || !isVerifyingPin ? (
          <Stack.Screen name="(auth)" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
    </>
  );
}

function RootLayoutContent() {
  const { theme } = useUniwind();
  const currentTheme = (theme ?? 'light') as 'light' | 'dark';

  return (
    <ThemeProvider value={NAV_THEME[currentTheme]}>
      <AuthNavigation />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
