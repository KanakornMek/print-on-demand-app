import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Icon from '@/components/common/Icon';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

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
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
      console.log("test")

      if (signInAttempt.status === 'complete') {
        console.log('Sign in completed1');
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

      const {
        createdSessionId,
        signIn: googleSignIn,
        signUp: googleSignUp,
        setActive: setGoogleActive,
      } = await startSSOFlow({
        redirectUrl,
        strategy: 'oauth_google',
      });

      if (createdSessionId && setGoogleActive) {
        await setGoogleActive({ session: createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.warn(
          '[Clerk] Google OAuth - No session ID, but signIn/signUp data might be available:',
          { googleSignIn, googleSignUp }
        );
        if (googleSignIn?.status && googleSignIn.status !== 'complete') {
          Alert.alert(
            'Google Sign In Incomplete',
            'Please follow the additional steps to complete your sign in.'
          );
        } else if (googleSignUp?.status && googleSignUp.status !== 'complete') {
          Alert.alert(
            'Google Sign Up Incomplete',
            'Please follow the additional steps to complete your sign up.'
          );
        } else {
          Alert.alert(
            'Google Sign In Failed',
            'Could not complete Google Sign-In. Please try again.'
          );
        }
      }
    } catch (err: any) {
      console.error('[Clerk] Google OAuth Error:', JSON.stringify(err, null, 2));
      Alert.alert(
        'Google Sign In Error',
        err.errors?.[0]?.message || 'An unexpected error occurred during Google Sign-In.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 items-center justify-center bg-amber-50 p-6">
        <View className="mb-8 w-full items-center">
          <Icon />
          <Text className="text-2xl font-bold text-amber-900">Welcome to SnapPress</Text>
          <Text className="text-amber-700">Sign in to your account</Text>
        </View>
        <View className="w-full gap-4">
          <View className="items-start gap-2">
            <Text className="text-amber-900">Email</Text>
            <View className="relative w-full">
              <Feather
                className="absolute left-3 top-6 z-10 -translate-y-1/2"
                name="mail"
                size={16}
                color="#b45309"
              />
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                onChangeText={(email) => setEmailAddress(email)}
                className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                keyboardType="email-address"
                placeholderTextColor={'#fbbf24'}
              />
            </View>
          </View>

          <View className="items-start gap-2">
            <Text className="text-amber-900">Password</Text>
            <View className="relative w-full">
              <Feather
                className="absolute left-3 top-6 z-10 -translate-y-1/2"
                name="lock"
                size={16}
                color="#b45309"
              />
              <TextInput
                value={password}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                placeholderTextColor={'#fbbf24'}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 z-10 -translate-y-1/2">
                {showPassword ? (
                  <Feather name="eye-off" size={16} color="#b45309" />
                ) : (
                  <Feather name="eye" size={16} color="#b45309" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#f59e0b" className="mb-4" />
          ) : (
            <TouchableOpacity
              onPress={onSignInPress}
              className="w-full items-center rounded-md bg-amber-500 py-2"
              disabled={googleLoading}>
              <Text className="text-lg font-semibold text-white">Sign In</Text>
            </TouchableOpacity>
          )}
          {googleLoading ? (
            <ActivityIndicator size="large" color="#f59e0b" className="mb-4" />
          ) : (
            <TouchableOpacity
              onPress={onSignInWithGooglePress}
              className="w-full items-center flex-row justify-center gap-2 rounded-md border-[1px] border-amber-300 bg-white py-2"
              disabled={loading}>
              <AntDesign name="google" size={16} color="#78350f" />
              <Text className="text-lg font-semibold text-amber-900">Sign In with Google</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row mt-8 justify-center">
          <Text className="text-amber-900">Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            disabled={loading || googleLoading}>
            <Text className="font-semibold text-amber-600">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
