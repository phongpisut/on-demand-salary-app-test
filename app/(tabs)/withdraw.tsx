import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Stack, useRouter } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { WalletIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react-native';
import { useProfile, withdraw as apiWithdraw, useTransactions } from '@/lib/api';
import { useToken } from '@/lib/auth';
import { createNumberMask } from 'react-native-mask-input';

const moneyMask = createNumberMask({
  delimiter: ',',
  precision: 3,
});

export default function WithdrawScreen() {
  const router = useRouter();
  const [token] = useToken();
  const { profile } = useProfile(token);
  const { available } = useTransactions(token);
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const withdrawAmount = parseInt(amount.replace(/,/g, '')) || 0;
  const maxWithdraw = profile?.maxWithdraw ?? 15000;
  const availableBalance = available ?? 0;
  const isValidAmount = withdrawAmount > 0 && withdrawAmount <= maxWithdraw;
  const percentage = maxWithdraw > 0 ? Math.min((withdrawAmount / maxWithdraw) * 100, 100) : 0;

  const handleWithdraw = async () => {
    if (!isValidAmount || !token) return;
    setLoading(true);

    try {
      const response = await apiWithdraw(withdrawAmount, token);

      if (response?.message === 'success') {
        Alert.alert('Success', `Successfully withdrew ฿${withdrawAmount.toLocaleString('th-TH')}`, [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              router.push('/(tabs)');
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const quickAmounts = [1000, 3000, 5000, 7500];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="bg-background flex-1" bounces={false}>
        {/* Header */}
        <View className="bg-primary rounded-b-3xl px-6 pt-20 pb-6">
          <Text className="text-primary-foreground text-2xl font-bold">Withdraw Money</Text>
          <Text className="text-primary-foreground/80 mt-1">Get your money instantly</Text>
        </View>

        <View className="gap-6 px-6 py-6">
          {/* Balance Card */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <View className="mb-4 flex-row items-center gap-3">
                <View className="bg-secondary-container h-10 w-10 items-center justify-center rounded-full">
                  <Icon as={WalletIcon} size={20} className="text-secondary-foreground" />
                </View>
                <View>
                  <Text className="text-muted-foreground text-sm">Available Balance</Text>
                  <Text className="text-foreground text-2xl font-bold">
                    ฿ {availableBalance.toLocaleString('th-TH')}
                  </Text>
                </View>
              </View>
              <View className="bg-secondary h-2 overflow-hidden rounded-full">
                <View className="bg-primary h-full" style={{ width: '50%' }} />
              </View>
              <Text className="text-muted-foreground mt-2 text-xs">
                You can withdraw up to 50% (฿ {maxWithdraw.toLocaleString('th-TH')})
              </Text>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <View className="gap-4">
            <Text className="text-foreground text-lg font-semibold">Amount to withdraw</Text>

            <View className="bg-card border-border rounded-xl border p-4">
              <Text className="text-muted-foreground mb-1 text-sm">THB</Text>
              <Input
                className="h-12 border-0 bg-transparent p-0 text-3xl font-bold"
                placeholder="0"
                mask={moneyMask}
                value={amount}
                maxLength={9}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Quick Amount Buttons */}
            <View className="flex-row flex-wrap gap-2">
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q}
                  onPress={() => handleQuickAmount(q)}
                  className={`rounded-full border px-4 py-2 ${
                    parseInt(amount) === q ? 'bg-primary border-primary' : 'bg-card border-border'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      parseInt(amount) === q ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                    ฿ {q.toLocaleString('th-TH')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Percentage Indicator */}
            {withdrawAmount > 0 && (
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">Percentage</Text>
                <Text className="text-foreground text-sm font-medium">
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            )}
          </View>

          {/* Info Box */}
          {withdrawAmount > maxWithdraw && (
            <View className="bg-destructive/10 flex-row items-center gap-3 rounded-xl p-4">
              <Icon as={AlertCircleIcon} className="text-destructive" size={20} />
              <Text className="text-destructive flex-1 text-sm">
                Amount exceeds maximum withdrawal limit of ฿ {maxWithdraw.toLocaleString('th-TH')}
              </Text>
            </View>
          )}

          {/* Withdraw Button */}
          <Button onPress={handleWithdraw} disabled={!isValidAmount || loading} className="h-14">
            <Text className="text-base font-semibold">
              {loading ? 'Processing...' : `Withdraw ฿ ${withdrawAmount.toLocaleString('th-TH')}`}
            </Text>
          </Button>

          {/* Info */}
          <View className="items-center gap-2">
            <View className="flex-row items-center gap-2">
              <Icon as={CheckCircleIcon} size={16} className="text-tertiary-foreground" />
              <Text className="text-muted-foreground text-xs">Instant transfer</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon as={CheckCircleIcon} size={16} className="text-tertiary-foreground" />
              <Text className="text-muted-foreground text-xs">No additional fees</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
