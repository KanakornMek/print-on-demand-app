import React from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
// import { CartProvider } from '@/contexts/CartContext'; 
// import { ThemeProvider } from '@/contexts/ThemeContext'; 
import { ActivityIndicator, View } from 'react-native';

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

  return (
    <>
      <SignedIn> {/* Show this (main app) if user is signed in */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Product Details', headerShown: false }} />
        </Stack>
      </SignedIn>
      <SignedOut> {/* Show this (authentication) if user is signed out */}
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SignedOut>
    </>
  );
}