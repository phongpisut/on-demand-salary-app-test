import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth';
import { Stack, useRouter } from 'expo-router';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as React from 'react';

const PIN_LENGTH = 6;

export default function VerifyPinScreen() {
  const router = useRouter();
  const { verifyPin, authState } = useAuth();
  const [pin, setPin] = React.useState('');
  const [showDigitIndex, setShowDigitIndex] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isComplete = pin.length === PIN_LENGTH;

  const handleDigitPress = (digit: string) => {
    if (isComplete || loading) return;

    const newPin = pin + digit;
    setPin(newPin);
    setError(null);
    setShowDigitIndex(newPin.length - 1);

    // Hide the digit after 500ms
    setTimeout(() => {
      setShowDigitIndex((prev) => {
        if (pin.length === prev) {
          return null;
        }
        return prev;
      });
    }, 500);
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isComplete || loading) return;

    setLoading(true);
    const success = await verifyPin(pin);
    setLoading(false);

    if (success) {
      router.replace(authState === 'change-pin' ? '/(auth)/passcode' : '/(tabs)');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const renderDots = () => {
    return (
      <View className="flex-row justify-center gap-4">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const isFilled = index < pin.length;
          const showNumber = index === showDigitIndex && isFilled;

          return (
            <View
              key={index}
              className={`h-4 w-4 rounded-full ${isFilled ? 'bg-primary' : 'bg-border'}`}>
              {showNumber && (
                <Text className="text-center text-xs font-bold text-white">{pin[index]}</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'del'],
    ];

    return (
      <View className="gap-4">
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center gap-6">
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} className="h-20 w-20" />;
              }

              if (key === 'del') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    onPress={handleDelete}
                    className="h-20 w-20 items-center justify-center"
                    disabled={pin.length === 0}>
                    <Text
                      className={`text-xl ${pin.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      ⌫
                    </Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  onPress={() => handleDigitPress(key)}
                  className="bg-card border-border h-20 w-20 items-center justify-center rounded-full border">
                  <Text className="text-foreground text-3xl font-semibold">{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const isLoading = authState === 'verifying-otp' || loading;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="bg-background flex-1 justify-center px-6">
        <View className="gap-12">
          <View className="gap-4">
            <Text className="text-foreground text-center text-3xl font-bold">Enter PIN</Text>
            <Text className="text-muted-foreground text-center text-base">
              Enter your 6-digit PIN to sign in
            </Text>
          </View>

          <View className="gap-8">
            {renderDots()}

            {error && <Text className="text-destructive text-center">{error}</Text>}

            {renderKeypad()}

            <Button
              onPress={handleSubmit}
              disabled={!isComplete || isLoading}
              className="h-12 w-full">
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold">Sign In</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}
