import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Welcome to the Home Screen!</Text>
      {user && <Text className="text-lg mb-2">Hello, {user.firstName || user.primaryEmailAddress?.emailAddress}!</Text>}
      <Link href="/product/123" asChild>
        <Button title="Go to Product 123" />
      </Link>
      <View className="my-2" />
      <Link href="/(auth)/login" asChild>
        <Button title="Go to Login (if not logged in)" />
      </Link>
    </View>
  );
}