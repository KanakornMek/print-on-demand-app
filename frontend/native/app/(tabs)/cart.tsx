import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { Button, ScrollView, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canGoBack } from 'expo-router/build/global-state/routing';
import { useState } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

export default function Cart() {
  const router = useRouter();
  const cartItemsDemo: CartItem[] = [
    {
      id: 1,
      title: 'T-shirt',
      price: 19.99,
      quantity: 2,
      color: 'Blue',
      size: 'M',
      image: 'https://placehold.co/100',
    },
    {
      id: 2,
      title: 'Cap',
      price: 9.99,
      quantity: 1,
      color: 'Red',
      size: 'L',
      image: 'https://placehold.co/100',
    },
  ];

  const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsDemo);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="flex-1 bg-amber-50">
        <View
          className="flex-row items-center bg-amber-400 px-4 py-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }}>
          <TouchableOpacity
            onPress={() => (canGoBack() ? router.back() : router.push('/(tabs)/home'))}
            className="mr-2 p-1">
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-amber-900">Shopping Cart</Text>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {cartItems.length > 0 ? (
            <>
              <View className="y-4 mb-6">
                {cartItems.map((item) => (
                  <View key={item.id} className="mt-4 flex-row rounded-lg bg-white p-3 shadow-sm">
                    <Image
                      source={item.image || 'https://placehold.co/100'}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 6,
                        marginRight: 12,
                      }}
                      alt={item.title}
                      contentFit="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between">
                        <Text className="font-medium text-amber-900">{item.title}</Text>
                        <Text className="font-medium text-amber-900">${item.price.toFixed(2)}</Text>
                      </View>
                      <Text className="mb-2 text-xs text-amber-700">
                        {item.color + ' / ' + item.size}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center rounded-md border border-amber-300">
                          <TouchableOpacity
                            className="h-7 w-7 items-center justify-center p-0"
                            onPress={() => {
                              const updatedCartItems = cartItems.map((i) =>
                                i.id === item.id
                                  ? { ...i, quantity: Math.max(i.quantity - 1, 1) }
                                  : i
                              );
                              setCartItems(updatedCartItems);
                            }}>
                            <Feather name="minus" size={16} color="#78350f" />
                          </TouchableOpacity>
                          <Text className="w-8 text-center text-sm text-amber-900">
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            className="h-7 w-7 items-center justify-center p-0"
                            onPress={() => {
                              const updatedCartItems = cartItems.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                              );
                              setCartItems(updatedCartItems);
                            }}>
                            <Feather name="plus" size={16} color="#78350f" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const updatedCartItems = cartItems.filter((i) =>
                              i.id !== item.id
                            );
                            setCartItems(updatedCartItems);
                          }}>
                          <Feather name="trash" size={20} color="#b45309" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <Text className="mb-3 font-semibold text-amber-900">Order Summary</Text>
                <View className="y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-amber-700">Subtotal</Text>
                    <Text className="text-sm text-amber-900">${subtotal.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-amber-700">Shipping</Text>
                    <Text className="text-sm text-amber-900">${shipping.toFixed(2)}</Text>
                  </View>
                  <View className="my-2 h-[1px] bg-amber-200" />
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-amber-900">Total</Text>
                    <Text className="font-semibold text-amber-900">${total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/checkout')}>
                <View className="mb-6 rounded-lg bg-amber-500 p-4 shadow-sm">
                  <Text className="text-center text-lg font-semibold text-white">Checkout</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center py-12">
              <View className="mb-4 rounded-full bg-amber-200 p-3">
                <Feather name="shopping-cart" size={24} color="#b45309" />
              </View>
              <Text>Your cart is empty</Text>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity className="mt-2 rounded-md bg-amber-500 px-6 py-3">
                  <Text className="font-medium text-white">Start Shopping</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
