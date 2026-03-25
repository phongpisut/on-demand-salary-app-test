import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useAuth, useToken } from '@/lib/auth';
import { useProfile, useTransactions } from '@/lib/api';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  WalletIcon,
  ChevronRightIcon,
  UserIcon,
} from 'lucide-react-native';
import Header from '@/components/ui/header';
import * as React from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [token] = useToken();
  const { signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile(token);
  const { available, transactions, isLoading: transactionsLoading } = useTransactions(token);
  const [showHeader, setShowHeader] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return `฿ ${amount.toLocaleString('th-TH')}`;
  };

  const isLoading = profileLoading || transactionsLoading;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollY > 10);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Home" visible={showHeader} />
      <ScrollView className="bg-background flex-1" bounces={false} onScroll={onScroll}>
        {/* Header */}
        <View className="bg-primary rounded-b-3xl px-6 pt-12 pb-8">
          <View className="flex-row items-center justify-between border-b-2 border-gray-100 pb-5">
            <View className="mt-10 flex-row items-center gap-3">
              <View className="bg-primary-container h-10 w-10 items-center justify-center rounded-full">
                <Icon as={UserIcon} className="text-primary" size={20} color="white" />
              </View>
              <View>
                <Text className="text-primary-foreground text-sm">Welcome back,</Text>
                <Text className="text-primary-foreground font-semibold">
                  {isLoading ? 'Loading...' : profile?.name || 'User'}
                </Text>
              </View>
            </View>
          </View>

          {/* Balance Card */}
          <Card className="bg-primary-container mt-4 border-0">
            <CardContent className="p-6">
              {isLoading ? (
                <ActivityIndicator color="white" className="py-8" />
              ) : (
                <>
                  <Text className="text-primary-foreground/80 text-sm">Available Balance</Text>
                  <Text className="text-primary-foreground mt-1 text-4xl font-bold">
                    {formatCurrency(available || 0)}
                  </Text>
                  <View className="mt-4 flex-row justify-between">
                    <View>
                      <Text className="text-primary-foreground/60 text-xs">Total Earned</Text>
                      <Text className="text-primary-foreground font-semibold">
                        {formatCurrency(profile?.totalEarned || 0)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-primary-foreground/60 text-xs">Max Withdraw</Text>
                      <Text className="text-primary-foreground font-semibold">
                        {formatCurrency(profile?.maxWithdraw || 0)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </CardContent>
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-6">
          <View className="flex-row gap-4">
            <Card className="bg-card border-border flex-1 border">
              <CardContent className="flex-row items-center gap-3 p-4">
                <View className="bg-secondary-container h-10 w-10 items-center justify-center rounded-full">
                  <Icon as={WalletIcon} size={20} className="text-secondary-foreground" />
                </View>
                <View>
                  <Text className="text-sm font-medium">Quick Withdraw</Text>
                  <Text className="text-muted-foreground text-xs">Up to 50%</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Transaction History */}
        <View className="px-6 pb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-semibold">Transactions</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-primary text-sm">See All</Text>
              <Icon as={ChevronRightIcon} size={16} className="text-primary" />
            </TouchableOpacity>
          </View>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {isLoading ? (
                <View className="items-center p-8">
                  <ActivityIndicator color="#00342d" />
                </View>
              ) : (
                (transactions || []).map((tx: any, index: number) => (
                  <View
                    key={`${tx.id}-${index}`}
                    className={`flex-row items-center justify-between p-4 ${
                      index < (transactions?.length || 0) - 1 ? 'border-border border-b' : ''
                    }`}>
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          tx.type === 'deposit' ? 'bg-tertiary-container' : 'bg-secondary-container'
                        }`}>
                        <Icon
                          as={tx.type === 'deposit' ? ArrowDownLeftIcon : ArrowUpRightIcon}
                          size={18}
                          className={
                            tx.type === 'deposit'
                              ? 'text-tertiary-foreground'
                              : 'text-secondary-foreground'
                          }
                        />
                      </View>
                      <View>
                        <Text className="text-foreground text-sm font-medium">
                          {tx.type === 'deposit' ? 'Salary Deposit' : 'Withdrawal'}
                        </Text>
                        <Text className="text-muted-foreground text-xs">{tx.date}</Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm font-semibold ${
                        tx.type === 'deposit' ? 'text-tertiary-foreground' : 'text-destructive'
                      }`}>
                      {tx.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </Text>
                  </View>
                ))
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
