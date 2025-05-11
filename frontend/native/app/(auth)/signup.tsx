import React from 'react';
import {
  View,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Icon from '@/components/common/Icon';
import Feather from '@expo/vector-icons/Feather';
import Button from '@/components/common/Button';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const disableSignup = !(emailAddress && password && firstName && lastName);

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
      Alert.alert(
        'Verification Error',
        err.errors?.[0]?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 items-center justify-center bg-amber-50 p-6">
        {!pendingVerification && (
          <>
            <View className="mb-8 w-full items-center">
              <Icon />
              <Text className="text-2xl font-bold text-amber-900">Join SnapPress</Text>
              <Text className="text-amber-700">Create your account</Text>
            </View>
            <View className="w-full gap-4">
              <View className="items-start gap-2">
                <Text className="text-amber-900">First Name</Text>
                <View className="relative w-full">
                  <Feather
                    className="absolute left-3 top-6 z-10 -translate-y-1/2"
                    name="user"
                    size={16}
                    color="#b45309"
                  />
                  <TextInput
                    autoCapitalize="words"
                    value={firstName}
                    placeholder="Enter your first name"
                    onChangeText={(name) => setFirstName(name)}
                    className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                    placeholderTextColor={'#fbbf24'}
                  />
                </View>
              </View>

              <View className="items-start gap-2">
                <Text className="text-amber-900">Last Name</Text>
                <View className="relative w-full">
                  <Feather
                    className="absolute left-3 top-6 z-10 -translate-y-1/2"
                    name="user"
                    size={16}
                    color="#b45309"
                  />
                  <TextInput
                    autoCapitalize="words"
                    value={lastName}
                    placeholder="Enter your last name"
                    onChangeText={(name) => setLastName(name)}
                    className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                    placeholderTextColor={'#fbbf24'}
                  />
                </View>
              </View>

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

              <View className="mb-2 items-start gap-2">
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
                    placeholder="Create a password"
                    secureTextEntry={!showPassword}
                    onChangeText={(password) => setPassword(password)}
                    className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                    placeholderTextColor={'#fbbf24'}
                  />
                  <Text className="mt-1 text-xs text-amber-700">
                    Password must be at least 8 characters long
                  </Text>
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
                <ActivityIndicator size="large" color="#f59e0b" />
              ) : (
                <Button disabled={disableSignup} onPress={onSignUpPress} text="Create Account" />
              )}
            </View>

            <View className="mt-8 flex-row justify-center">
              <Text className="text-amber-900">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="font-semibold text-amber-600">Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {pendingVerification && (
          <>
            <View className="mb-6 w-full items-center">
              <Icon />
              <Text className="text-2xl font-bold text-amber-900">Verify your Email</Text>
              <Text className="text-amber-700">Verification code has been sent to your email</Text>
            </View>
            <View className=" mb-4 relative w-full">
              <Feather
                className="absolute left-3 top-6 z-10 -translate-y-1/2"
                name="key"
                size={16}
                color="#b45309"
              />
              <TextInput
                value={code}
                placeholder="Verification Code"
                onChangeText={(code) => setCode(code)}
                className="h-12 w-full rounded-md border border-amber-300 bg-white px-4 pl-10 text-base text-amber-900 focus:ring-amber-500"
                placeholderTextColor={'#fbbf24'}
                keyboardType="number-pad"
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#3b82f6" />
            ) : (
              <Button onPress={onPressVerify} text="Verify"/>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
