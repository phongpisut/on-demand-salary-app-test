import { Tabs } from 'expo-router';
import { Settings, HomeIcon, WalletIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useEffect } from 'react';
import { emitter } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Alert } from 'react-native';

export default function TabsLayout() {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleTokenExpired = () => {
      signOut();
      Alert.alert('Token Expire', 'Your token has expired. Please sign in again.', [
        {
          text: 'OK',
        },
      ]);
    };
    emitter.addListener('token-expired', handleTokenExpired);
    return () => {
      emitter.removeListener('token-expired', handleTokenExpired);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00342d',
        tabBarInactiveTintColor: '#707975',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e1e3e4',
          height: 84,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTitleStyle: {
          color: '#191c1d',
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Salary Hero',
          tabBarIcon: ({ color, size }) => <Icon as={HomeIcon} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="withdraw"
        options={{
          title: 'Withdraw',
          headerTitle: 'Withdraw Money',
          tabBarIcon: ({ color, size }) => <Icon as={WalletIcon} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon as={Settings} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
