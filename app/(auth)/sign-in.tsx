import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth';
import { Stack, useRouter } from 'expo-router';
import { View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import * as React from 'react';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, authState, error } = useAuth();
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) return;
    setLoading(true);
    
    await signIn(phone);
    setLoading(false);
    router.push('/(auth)/otp');
  };

  const isLoading = authState === 'signing-in' || loading;
  const rawPhone = phone.replace(/\D/g, '');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <View className="flex-1 justify-center px-6">
          <View className="gap-8">
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">
                Welcome Back
              </Text>
              <Text className="text-base text-muted-foreground">
                Sign in with your phone number
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">
                  Phone Number
                </Text>
                <Input
                  placeholder="000-000-0000"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  className="h-12"
                  mask="000-000-0000"
                />
              </View>

              {error && (
                <Text className="text-sm text-destructive">{error}</Text>
              )}

              <Button
                onPress={handleSignIn}
                disabled={isLoading || rawPhone.length < 10}
                className="h-12 w-full"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold">
                    Continue
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}