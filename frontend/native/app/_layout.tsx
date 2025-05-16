import React from 'react';
import { Text } from 'react-native';
import { Stack } from 'expo-router';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
// import { CartProvider } from '@/contexts/CartContext'; 
// import { ThemeProvider } from '@/contexts/ThemeContext'; 
import { ActivityIndicator, View } from 'react-native';
import { StarHalfIcon } from 'lucide-react';
import { configureReanimatedLogger } from 'react-native-reanimated';

configureReanimatedLogger({
  strict: false,
});

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Key Bro. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file Bro.');
}

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}> 
        {/* <CartProvider> */}
          {/* <ThemeProvider> */}
            <RootNavigation />
          {/* </ThemeProvider> */}
        {/* </CartProvider> */}
    </ClerkProvider>
  );
} // Wrap app around clerk to use SignedIn SignedOut

function RootNavigation() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <>
      <SignedIn> 
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="store/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="store/index" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="design/index" options={{ headerShown: false }} />
          <Stack.Screen name="preview/[encodedUrl]" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>
      <SignedOut> 
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SignedOut>
    </>
  );
}