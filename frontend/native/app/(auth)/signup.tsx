import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Sign Up Error', err.errors?.[0]?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert('Verification Failed', 'Please check the code and try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Verification Error', err.errors?.[0]?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50">
      {!pendingVerification && (
        <>
          <Text className="text-3xl font-bold mb-8 text-blue-600">Create Account</Text>
          <TextInput
            autoCapitalize="words"
            value={firstName}
            placeholder="First Name"
            onChangeText={(name) => setFirstName(name)}
            className="w-full h-12 border border-gray-300 rounded-md px-4 mb-4 text-base bg-white"
          />
          <TextInput
            autoCapitalize="words"
            value={lastName}
            placeholder="Last Name"
            onChangeText={(name) => setLastName(name)}
            className="w-full h-12 border border-gray-300 rounded-md px-4 mb-4 text-base bg-white"
          />
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
              onPress={onSignUpPress}
              className="w-full bg-blue-600 py-3 rounded-md items-center mb-4"
            >
              <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>
          )}

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-blue-600 font-semibold">Log In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {pendingVerification && (
        <>
          <Text className="text-2xl font-bold mb-6 text-blue-600">Verify Your Email</Text>
          <TextInput
            value={code}
            placeholder="Verification Code"
            onChangeText={(code) => setCode(code)}
            className="w-full h-12 border border-gray-300 rounded-md px-4 mb-6 text-base bg-white"
            keyboardType="number-pad"
          />
          {loading ? (
             <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <TouchableOpacity
              onPress={onPressVerify}
              className="w-full bg-green-500 py-3 rounded-md items-center"
            >
              <Text className="text-white text-lg font-semibold">Verify Email</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}