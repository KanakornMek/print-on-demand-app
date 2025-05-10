import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)'); // Navigate to your main app screen
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Login Error', err.errors?.[0]?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50">
      <Text className="text-3xl font-bold mb-8 text-blue-600">Login</Text>

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email Address"
        onChangeText={(email) => setEmailAddress(email)}
        className="w-full h-12 border border-gray-300 rounded-md px-4 mb-4 text-base bg-white"
        keyboardType="email-address"
      />

      <TextInput
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        className="w-full h-12 border border-gray-300 rounded-md px-4 mb-6 text-base bg-white"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <TouchableOpacity
          onPress={onSignInPress}
          className="w-full bg-blue-600 py-3 rounded-md items-center mb-4"
        >
          <Text className="text-white text-lg font-semibold">Sign In</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text className="text-blue-600 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}