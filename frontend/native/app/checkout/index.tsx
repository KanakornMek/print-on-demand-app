import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { ScrollView, Text, TouchableOpacity, View, TextInput, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canGoBack, replace } from 'expo-router/build/global-state/routing';
import { useState } from 'react';

const checkoutOrderItems = [
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

export default function Checkout() {
  const router = useRouter();
  const [selectedShippingOption, setSelectedShippingOption] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const subtotal = checkoutOrderItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shippingOptions = [
    { label: 'Standard Shipping (5-7 days)', cost: 4.99 },
    { label: 'Express Shipping (2-3 days)', cost: 10.99 },
  ];

  const paymentOptions = [
    { label: 'Credit Card', icon: 'credit_card' },
    { label: 'PayPal', icon: 'dollar_sign' },
  ];

  const shippingCost = shippingOptions[selectedShippingOption].cost;
  const total = subtotal + shippingCost;

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <Modal
        className="w-full items-center justify-center"
        transparent={true}
        animationType="slide"
        visible={showAlert}>
        <View className='flex-1 bg-black/20 items-center justify-center'>
          <View className="h-32 w-1/2 gap-4 items-center justify-center rounded-md bg-white">
            <Text className='text-center'>Order has been placed!</Text>
            <Pressable className='bg-amber-500 rounded p-2' onPress={()=>router.replace("/")}><Text>Back to home</Text></Pressable>
          </View>
        </View>
      </Modal>
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
            onPress={() => (canGoBack() ? router.back() : router.push('/cart'))}
            className="mr-2 p-1">
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-amber-900">Checkout</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <TouchableOpacity
            className="mb-6 flex-row justify-between rounded-lg bg-white p-4 shadow-sm"
            onPress={() => router.push('/checkout/address')}>
            <View>
              <Text className="mb-3 text-base font-semibold text-amber-900">Shipping Address</Text>
              <View className="py-1">
                <Text className="text-sm text-amber-800">Suphasan</Text>
                <Text className="text-sm text-amber-800">254 Phaya Thai Rd</Text>
                <Text className="text-sm text-amber-800">Wang Mai</Text>
                <Text className="text-sm text-amber-800">Pathum Wan</Text>
                <Text className="text-sm text-amber-800">Bangkok, 10330</Text>
                <Text className="text-sm text-amber-800">Thailand</Text>
              </View>
            </View>
            <View className="items-center justify-center py-2">
              <Feather name="chevron-right" size={20} color="#78350f" />
            </View>
          </TouchableOpacity>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-amber-900">Order Items</Text>
            {checkoutOrderItems.map((item) => (
              <View
                key={item.id}
                className="mt-3 flex-row border-b border-amber-100 pb-3 last:border-b-0 last:pb-0">
                <Image
                  source={item.image || 'https://placehold.co/80'}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                  alt={item.title}
                  contentFit="cover"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text
                      className="w-3/4 font-medium text-amber-900"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <Text className="font-medium text-amber-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-xs text-amber-700">Qty: {item.quantity}</Text>
                  <Text className="mb-1 text-xs text-amber-700">
                    {item.color + ' / ' + item.size}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-amber-900">Shipping Options</Text>
            {Object.keys(shippingOptions).map((val, idx) => (
              <TouchableOpacity
                key={idx}
                className={`mt-2 flex-row items-center justify-between rounded-md border p-3 ${selectedShippingOption === idx ? 'border-amber-500 bg-amber-50' : 'border-amber-200'}`}
                onPress={() => setSelectedShippingOption(idx)}>
                <View className="flex-row items-center">
                  <View
                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedShippingOption === idx ? 'border-amber-600 bg-amber-600' : 'border-amber-400'}`}>
                    {selectedShippingOption === idx && (
                      <View className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Text
                    className={`text-sm ${selectedShippingOption === idx ? 'font-medium text-amber-800' : 'text-amber-700'}`}>
                    {shippingOptions[idx].label}
                  </Text>
                </View>
                <Text
                  className={`text-sm font-medium ${selectedShippingOption === idx ? 'text-amber-900' : 'text-amber-800'}`}>
                  ${shippingOptions[idx].cost.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-amber-900">Payment Method</Text>
            </View>
            {paymentOptions.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                className={`mt-2 flex-row items-center rounded-md border p-3 ${selectedPaymentOption === idx ? 'border-amber-500 bg-amber-50' : 'border-amber-200'}`}
                onPress={() => setSelectedPaymentOption(idx)}>
                <Feather
                  name={paymentOptions[idx].icon === 'credit_card' ? 'credit-card' : 'dollar-sign'}
                  size={20}
                  color="#78350f"
                  className="mr-3"
                />
                <Text className="text-sm text-amber-800">
                  {paymentOptions[idx].icon === 'credit_card'
                    ? 'Visa **** **** **** 1234'
                    : 'PayPal Account'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-amber-900">Order Summary</Text>
            <View className="y-2">
              <View className="mb-1 flex-row justify-between">
                <Text className="text-sm text-amber-700">Subtotal</Text>
                <Text className="text-sm text-amber-900">${subtotal.toFixed(2)}</Text>
              </View>
              <View className="mb-1 flex-row justify-between">
                <Text className="text-sm text-amber-700">Shipping</Text>
                <Text className="text-sm text-amber-900">${shippingCost.toFixed(2)}</Text>
              </View>

              <View className="my-2 h-[1px] bg-amber-200" />
              <View className="flex-row justify-between">
                <Text className="text-base font-semibold text-amber-900">Total</Text>
                <Text className="text-base font-semibold text-amber-900">${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('Order Placed:', {
                items: checkoutOrderItems,
                shippingAddress:
                  'Suphasan, 254 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok, 10330, Thailand',
                shippingOption: selectedShippingOption,
                paymentOption: selectedPaymentOption,
                subtotal,
                shippingCost,
                total,
              });
              setShowAlert(true);
            }}>
            <View className="mb-6 rounded-lg bg-amber-500 p-4 shadow-sm">
              <Text className="text-center text-lg font-semibold text-white">Place Order</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
