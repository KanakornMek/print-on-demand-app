import { Link, useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { Image } from "expo-image";
import { Button, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";

export default function Cart() {
  const router = useRouter();
  const cartItems = [
    {
      id: 1,
      title: 'T-shirt',
      price: 19.99,
      quantity: 2,
      color: 'Blue',
      size: 'M',
      image: "https://placehold.co/100",
    },
    {
      id: 2,
      title: 'Cap',
      price: 9.99,
      quantity: 1,
      color: 'Red',
      size: 'L',
      image: "https://placehold.co/100",
    },
  ]

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }
  , 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="flex-1 bg-amber-50">

      <View 
        className="bg-amber-400 px-4 py-3 flex-row items-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2, 
        }}
      >
        <TouchableOpacity onPress={() => canGoBack() ? router.back() : router.push('/(tabs)/home')} className="mr-2 p-1">
          <Feather name="arrow-left" size={24} color="#78350f" />
        </TouchableOpacity>
        <Text className="font-semibold text-amber-900 text-lg">Shopping Cart</Text>
      </View>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      >
        {cartItems.length > 0 ? (
          <>
            <View className="y-4 mb-6">
              {cartItems.map((item) => (
                <View key={item.id} className="bg-white rounded-lg p-3 shadow-sm flex-row mt-4">
                  <Image 
                    source={item.image || "https://placehold.co/100" }
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 6,
                      marginRight: 12
                    }}
                    alt={item.title}
                    contentFit="cover"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-medium text-amber-900">{item.title}</Text>
                      <Text className="font-medium text-amber-900">${(item.price).toFixed(2)}</Text>
                    </View>
                    <Text className="text-xs text-amber-700 mb-2">{item.color + ' / ' + item.size}</Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center border border-amber-300 rounded-md">
                        <TouchableOpacity
                          className="h-7 w-7 items-center justify-center p-0"
                          onPress={() => {}}
                        >
                          <Feather name='minus' size={16} color='#78350f'/>
                        </TouchableOpacity>
                        <Text className="w-8 text-center text-sm text-amber-900">{item.quantity}</Text>
                        <TouchableOpacity
                          className="h-7 w-7 items-center justify-center p-0"
                          onPress={() => {}}
                        >
                          <Feather name='plus' size={16} color='#78350f'/>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity>
                        <Feather name="trash" size={20} color="#b45309" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <Text className="font-semibold text-amber-900 mb-3">Order Summary</Text>
              <View className="y-2">
                <View className="flex-row justify-between">
                  <Text className="text-amber-700 text-sm">Subtotal</Text>
                  <Text className="text-amber-900 text-sm">${subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-amber-700 text-sm">Shipping</Text>
                  <Text className="text-amber-900 text-sm">${shipping.toFixed(2)}</Text>
                </View>
                <View className="my-2 bg-amber-200 h-[1px]"/>
                <View className="flex-row justify-between">
                  <Text className="text-amber-900 font-semibold">Total</Text>
                  <Text className="text-amber-900 font-semibold">${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
              <View className="bg-amber-500 rounded-lg p-4 shadow-sm mb-6">
                <Text className="text-center text-white font-semibold text-lg">Checkout</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <View className="items-center py-12">
            <View className="bg-amber-200 rounded-full p-3 mb-4">
              <Feather name="shopping-cart" size={24} color="#b45309" />
            </View>
            <Text>Your cart is empty</Text>
            <Link href="/(tabs)" asChild>
              <TouchableOpacity className="bg-amber-500 py-3 px-6 rounded-md mt-2">
                <Text className="text-white font-medium">Start Shopping</Text>
              </TouchableOpacity>
            </Link>

          </View>
        )
        }

      </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}