import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments(); // Ex. segments = ['(auth)', 'login']
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)'); // If user is signed in -> shouldn't be here -> redirect to the app
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/login'); // If user not signed in and trying to access main app (not in auth) -> redirect to login
    }
  }, [isSignedIn, isLoaded, segments, router]); // Re-run based on status conditions ()

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } // Show loading screen while loading

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}