import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
};

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  startSSOFlow({strategy: 'oauth_google'});
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  useWarmUpBrowser();

  const onSignInPress = async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'Clerk is not ready yet. Please try again in a moment.');
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
        router.replace('/(tabs)');
      } else {
        console.error('[Clerk] Sign In Status:', JSON.stringify(signInAttempt, null, 2));
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error('[Clerk] Login Error:', JSON.stringify(err, null, 2));
      Alert.alert('Login Error', err.errors?.[0]?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const onSignInWithGooglePress = async () => {
    if (!isLoaded) {
      Alert.alert('Error', 'Clerk is not ready yet. Please try again in a moment.');
      return;
    }
    setGoogleLoading(true);
    try {

      const redirectUrl = Linking.createURL('/sso-callback');

      const { createdSessionId, signIn: googleSignIn, signUp: googleSignUp, setActive: setGoogleActive } = await startSSOFlow({
        redirectUrl,
        strategy: 'oauth_google'
      });

      if (createdSessionId && setGoogleActive) {
        await setGoogleActive({ session: createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.warn('[Clerk] Google OAuth - No session ID, but signIn/signUp data might be available:', { googleSignIn, googleSignUp });
        if (googleSignIn?.status && googleSignIn.status !== 'complete') {
            Alert.alert('Google Sign In Incomplete', 'Please follow the additional steps to complete your sign in.');
        } else if (googleSignUp?.status && googleSignUp.status !== 'complete') {
            Alert.alert('Google Sign Up Incomplete', 'Please follow the additional steps to complete your sign up.');
        } else {
            Alert.alert('Google Sign In Failed', 'Could not complete Google Sign-In. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('[Clerk] Google OAuth Error:', JSON.stringify(err, null, 2));
      Alert.alert('Google Sign In Error', err.errors?.[0]?.message || 'An unexpected error occurred during Google Sign-In.');
    } finally {
      setGoogleLoading(false);
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
        <ActivityIndicator size="large" color="#3b82f6" className="mb-4" />
      ) : (
        <TouchableOpacity
          onPress={onSignInPress}
          className="w-full bg-blue-600 py-3 rounded-md items-center mb-4"
          disabled={googleLoading}
        >
          <Text className="text-white text-lg font-semibold">Sign In</Text>
        </TouchableOpacity>
      )}

      {googleLoading ? (
        <ActivityIndicator size="large" color="#DB4437" className="mb-4" />
      ) : (
        <TouchableOpacity
          onPress={onSignInWithGooglePress}
          className="w-full bg-red-500 py-3 rounded-md items-center mb-4" 
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">Sign In with Google</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} disabled={loading || googleLoading}>
          <Text className="text-blue-600 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}