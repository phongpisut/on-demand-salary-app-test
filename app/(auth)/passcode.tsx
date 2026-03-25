import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth';
import { Stack, useRouter } from 'expo-router';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as React from 'react';

const PIN_LENGTH = 6;

export default function SetPinScreen() {
  const router = useRouter();
  const { setPin, authState } = useAuth();
  const [pin, setPinState] = React.useState('');
  const [confirmPin, setConfirmPin] = React.useState('');
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [showDigitIndex, setShowDigitIndex] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const currentPin = isConfirming ? confirmPin : pin;
  const isComplete = currentPin.length === PIN_LENGTH;

  const handleDigitPress = (digit: string) => {
    if (isComplete || loading) return;

    const newPin = currentPin + digit;
    
    if (isConfirming) {
      setConfirmPin(newPin);
      setShowDigitIndex(newPin.length - 1);
    } else {
      setPinState(newPin);
      setShowDigitIndex(newPin.length - 1);
    }

    // Hide the digit after 500ms
    setTimeout(() => {
      setShowDigitIndex((prev) => {
        if ((isConfirming ? confirmPin.length : pin.length) === prev) {
          return null;
        }
        return prev;
      });
    }, 500);
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPinState((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) return;

    if (!isConfirming) {
      // Move to confirm stage
      setIsConfirming(true);
    } else {
      // Verify and set PIN
      if (pin !== confirmPin) {
        alert('PINs do not match. Please try again.');
        setPinState('');
        setConfirmPin('');
        setIsConfirming(false);
        return;
      }

      setLoading(true);
      const success = await setPin(pin);
      setLoading(false);

      if (success) {
        router.replace('/(tabs)');
      }
    }
  };

  const renderDots = () => {
    return (
      <View className="flex-row justify-center gap-4">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const isFilled = index < currentPin.length;
          const showNumber = index === showDigitIndex && isFilled;
          
          return (
            <View
              key={index}
              className={`w-4 h-4 rounded-full ${
                isFilled ? 'bg-primary' : 'bg-border'
              }`}
            >
              {showNumber && (
                <Text className="text-center text-xs font-bold text-white">
                  {currentPin[index]}
                </Text>
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
                return <View key={keyIndex} className="w-20 h-20" />;
              }

              if (key === 'del') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    onPress={handleDelete}
                    className="w-20 h-20 items-center justify-center"
                    disabled={currentPin.length === 0}
                  >
                    <Text className={`text-xl ${currentPin.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      ⌫
                    </Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  onPress={() => handleDigitPress(key)}
                  className="w-20 h-20 items-center justify-center bg-card rounded-full border border-border"
                >
                  <Text className="text-3xl font-semibold text-foreground">
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background justify-center px-6">
        <View className="gap-12">
          <View className="gap-4">
            <Text className="text-3xl font-bold text-foreground text-center">
              {isConfirming ? 'Confirm PIN' : 'Set Your PIN'}
            </Text>
            <Text className="text-base text-muted-foreground text-center">
              {isConfirming
                ? 'Enter your PIN again to confirm'
                : 'Create a 6-digit PIN to secure your account'}
            </Text>
          </View>

          <View className="gap-8">
            {renderDots()}

            {renderKeypad()}

            <Button
              onPress={handleSubmit}
              disabled={!isComplete}
              className="h-12 w-full"
            >
               <Text className="text-base font-semibold">
                  {isConfirming ? 'Confirm' : 'Continue'}
                </Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}