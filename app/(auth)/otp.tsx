import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth, usePhone, useAuthError } from '@/lib/auth';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as React from 'react';

export default function OTPScreen() {
  const router = useRouter();
  const { verifyOtp, hasPin } = useAuth();
  const [phone] = usePhone();
  const [error] = useAuthError();
  const [otp, setOtp] = React.useState('');

  const handleVerify = async () => {
    if (!otp || otp.length < 6) return;

    const success = await verifyOtp(otp);

    if (success) {
      router.replace(`/(auth)/${hasPin ? 'verify-pin' : 'passcode'}`);
    }
  };

  const handleResend = () => {
    // For now, just show an alert
    alert('OTP resent to your phone. Use 123456 for testing.');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="bg-background flex-1">
        <View className="flex-1 justify-center px-6">
          <View className="gap-8">
            <View className="gap-2">
              <Text className="text-foreground text-3xl font-bold">Verify Code</Text>
              <Text className="text-muted-foreground text-base">
                Enter the 6-digit code sent to {phone || 'your phone'}
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-foreground text-sm font-medium">Verification Code</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="bg-background h-12 flex-1 rounded-md border-b-2 border-gray-400 px-4 text-center text-3xl"
                    placeholder="000000"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
                <Text className="text-muted-foreground mt-2 text-xs">Test OTP: 123456</Text>
              </View>

              <Button onPress={handleVerify} disabled={otp.length < 6} className="h-12 w-full">
                {otp.length < 6 ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold">Verify</Text>
                )}
              </Button>

              <View className="flex-row justify-center gap-2">
                <Text className="text-muted-foreground text-sm">Didn't receive code?</Text>
                <TouchableOpacity onPress={handleResend}>
                  <Text className="text-primary text-sm font-semibold">Resend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
