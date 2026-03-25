import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useToken, useAuth } from '@/lib/auth';
import { useProfile } from '@/lib/api';
import { Stack, useRouter } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import {
  UserIcon,
  ShieldIcon,
  ChevronRightIcon,
  LogOutIcon,
  type LucideIcon,
} from 'lucide-react-native';
import * as React from 'react';

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-card border-border flex-row items-center justify-between border-b p-4"
      disabled={!onPress}>
      <View className="flex-row items-center gap-4">
        <View className="bg-secondary-container h-10 w-10 items-center justify-center rounded-full">
          <Icon as={icon} size={20} className="text-secondary-foreground" />
        </View>
        <View>
          <Text className="text-foreground text-sm font-medium">{title}</Text>
          {subtitle && <Text className="text-muted-foreground text-xs">{subtitle}</Text>}
        </View>
      </View>
      {rightElement ||
        (onPress && <Icon as={ChevronRightIcon} size={20} className="text-muted-foreground" />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [token] = useToken();
  const { signOut, startChangePin } = useAuth();
  const { profile, isLoading } = useProfile(token);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const onChangePin = () => {
    startChangePin();
    router.push('/(auth)/verify-pin');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="bg-background flex-1" bounces={false}>
        {/* Header */}
        <View className="bg-primary rounded-b-3xl px-6 pt-20 pb-8">
          <Text className="text-primary-foreground text-2xl font-bold">Settings</Text>
          <Text className="text-primary-foreground/80 mt-1">Manage your account</Text>
        </View>

        <View className="gap-6 px-6 py-6">
          {/* Profile Card */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              {isLoading ? (
                <ActivityIndicator color="#00342d" />
              ) : (
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary-container h-16 w-16 items-center justify-center rounded-full">
                    <Icon as={UserIcon} size={32} className="text-primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-lg font-semibold">
                      {profile?.name || 'User'}
                    </Text>
                    <Text className="text-muted-foreground text-sm">{profile?.email}</Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <View>
            <Text className="text-muted-foreground mb-2 px-2 text-sm font-medium">Account</Text>
            <Card className="bg-card border-border overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <SettingItem icon={ShieldIcon} title="Change PIN" onPress={onChangePin} />
              </CardContent>
            </Card>
          </View>

          {/* Sign Out */}
          <Button variant="outline" onPress={handleSignOut} className="border-destructive/50 h-12">
            <Icon as={LogOutIcon} className="text-destructive mr-2" size={20} />
            <Text className="text-destructive font-medium">Sign Out</Text>
          </Button>

          {/* App Info */}
          <View className="items-center gap-1 py-4">
            <Text className="text-muted-foreground text-xs">
              Salary Hero (Phongpisut Meemuk) v1.0.0
            </Text>
            <Text className="text-muted-foreground text-xs">© 2026 All rights reserved</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
