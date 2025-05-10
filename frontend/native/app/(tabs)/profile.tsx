import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  if (!isSignedIn || !user) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg mb-4">You are not signed in.</Text>
        <Button title="Go to Login" onPress={() => router.push('/(auth)/login')} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <Text className="text-lg mb-2">Email: {user.primaryEmailAddress?.emailAddress}</Text>
      <Text className="text-lg mb-2">First Name: {user.firstName || 'Not set'}</Text>
      <Text className="text-lg mb-4">Last Name: {user.lastName || 'Not set'}</Text>
      <Button title="Sign Out" onPress={handleSignOut} color="red" />
    </View>
  );
}