import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn, isLoaded, segments, router]);

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}