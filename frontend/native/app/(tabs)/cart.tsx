import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Image } from "expo-image";
import { Button, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  variant_id: number;
  variant_color: string;
  variant_size: string | null;
  variant_image_url: string;
  variant_stock_status: string;
  variant_price_modifier: number;
  base_price: number;
  unit_price: number;
  item_total_price: number;
  quantity: number;
  customization_details: string | null;
  design_id: number | null; 
  design_name: string | null;
  design_final_image_url: string | null;
  user_id: number;
}


export default function Cart() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { getToken } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchCartItems = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${apiUrl}/api/cart`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log('Fetched cart items:', data);
          setCartItems(data.cart)
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }

        
      };

      fetchCartItems();
      return () => {
          console.log('Cleanup function called');
      }
    }, [])
  )
  
  // const cartItems = [
  //   {
  //     id: 1,
  //     title: 'T-shirt',
  //     price: 19.99,
  //     quantity: 2,
  //     color: 'Blue',
  //     size: 'M',
  //     image: "https://placehold.co/100",
  //   },
  //   {
  //     id: 2,
  //     title: 'Cap',
  //     price: 9.99,
  //     quantity: 1,
  //     color: 'Red',
  //     size: 'L',
  //     image: "https://placehold.co/100",
  //   },
  // ]

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity;
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
                      source={item.design_final_image_url || 'https://placehold.co/100'}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 6,
                        marginRight: 12,
                      }}
                      alt={item.product_name}
                      contentFit="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between">
                        <Text className="font-medium text-amber-900">{item.product_name}</Text>
                        <Text className="font-medium text-amber-900">฿{item.unit_price.toFixed(2)}</Text>
                      </View>
                      <Text className="mb-2 text-xs text-amber-700">
                        {item.variant_color + ' / ' + item.variant_size}
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
                    <Text className="text-sm text-amber-900">฿{subtotal.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-amber-700">Shipping</Text>
                    <Text className="text-sm text-amber-900">฿{shipping.toFixed(2)}</Text>
                  </View>
                  <View className="my-2 h-[1px] bg-amber-200" />
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-amber-900">Total</Text>
                    <Text className="font-semibold text-amber-900">฿{total.toFixed(2)}</Text>
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
