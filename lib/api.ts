import { atom, useAtom } from 'jotai';
import { EventEmitter } from 'expo';
import useSWR from 'swr';

export const emitter = new EventEmitter<any>();
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

// Token storage atom
export const tokenAtom = atom<string | null>(null);

const handle403 = () => {
  emitter.emit('token-expired', true);
};

// Fetcher function for useSWR
const fetcher = async (url: string, token: string | null) => {
  if (!token) throw new Error('No token');

  const res = await fetch(`${API_BASE}/${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 403) {
      handle403();
    }
    const error = new Error('API request failed');
    throw error;
  }

  return res.json();
};

// API functions that use real fetch (or fall back to mock)
export const signIn = async (phone: string) => {
  try {
    const res = await fetch(`${API_BASE}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      if (res.status === 403) {
        handle403();
      }
      throw new Error('Sign in failed');
    }
    return res.json();
  } catch {
    // Fallback to mock
    console.error('Sign in failed');
  }
};

export const verifyOtp = async (phone: string, otp: string) => {
  try {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (otp === '123456') {
          resolve('success');
        } else {
          reject('Invalid OTP');
        }
      }, 400)
    );
  } catch {
    // Fallback to mock
    console.error('OTP verification failed');
  }
};

export const withdraw = async (amount: number, token: string) => {
  try {
    const res = await fetch(`${API_BASE}/user/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: amount.toString() }),
    });
    if (!res.ok) {
      if (res.status === 403) {
        handle403();
      }
      throw new Error('Withdraw failed');
    }
    return res.json();
  } catch {
    // Fallback to mock
    console.error('Withdraw failed');
  }
};

// Hooks using useSWR
export function useProfile(token: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    token ? [`user/profile`, token] : null,
    ([url, t]) => fetcher(url, t),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      fallbackData: token,
    }
  );

  return {
    profile: {
      ...data?.data,
      name: `${data?.data?.firstname} ${data?.data?.lastname}`,
    },
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}

export function useTransactions(token: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    token ? [`user/transactions`, token] : null,
    ([url, t]) => fetcher(url, t),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      fallbackData: undefined,
    }
  );

  return {
    data,
    available: data?.data?.available,
    transactions: data?.data?.transactions || [],
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}
