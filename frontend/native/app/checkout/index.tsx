import { Link, useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";
import { useState } from "react";

const checkoutOrderItems = [
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
];

export default function Checkout() {
  const router = useRouter();
  const [selectedShippingOption, setSelectedShippingOption] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(0);

  const subtotal = checkoutOrderItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const shippingOptions = [
    { label: "Standard Shipping (5-7 days)", cost: 4.99 },
    { label: "Express Shipping (2-3 days)", cost: 10.99 },
  ];

  const paymentOptions = [
    { label: "Credit Card", icon: "credit_card" },
    { label: "PayPal", icon: "dollar_sign" },
];

  const shippingCost = shippingOptions[selectedShippingOption].cost;
  const total = subtotal + shippingCost;

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
          <TouchableOpacity onPress={() => canGoBack() ? router.back() : router.push('/cart')} className="mr-2 p-1">
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
          <Text className="font-semibold text-amber-900 text-lg">Checkout</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
        >
            <TouchableOpacity 
                className="bg-white rounded-lg p-4 shadow-sm mb-6 flex-row justify-between"
                onPress={() => router.push('/checkout/address')}
            >
                <View>

                    <Text className="font-semibold text-amber-900 text-base mb-3">Shipping Address</Text>
                    <View className="py-1">
                    <Text className="text-amber-800 text-sm">Suphasan</Text>
                    <Text className="text-amber-800 text-sm">254 Phaya Thai Rd</Text>
                    <Text className="text-amber-800 text-sm">Wang Mai</Text>
                    <Text className="text-amber-800 text-sm">Pathum Wan</Text>
                        <Text className="text-amber-800 text-sm">Bangkok, 10330</Text>
                        <Text className="text-amber-800 text-sm">Thailand</Text>
                    </View>
                </View>
                <View 
                    className="py-2 items-center justify-center"
                    
                >
                <Feather name="chevron-right" size={20} color="#78350f" />
                </View>

            </TouchableOpacity>

          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="font-semibold text-amber-900 text-base mb-3">Order Items</Text>
            {checkoutOrderItems.map((item) => (
              <View key={item.id} className="flex-row mt-3 pb-3 border-b border-amber-100 last:border-b-0 last:pb-0">
                <Image
                  source={item.image || "https://placehold.co/80"}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 6,
                    marginRight: 12
                  }}
                  alt={item.title}
                  contentFit="cover"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text className="font-medium text-amber-900 w-3/4" numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                    <Text className="font-medium text-amber-900">${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                  <Text className="text-xs text-amber-700">Qty: {item.quantity}</Text>
                  <Text className="text-xs text-amber-700 mb-1">{item.color + ' / ' + item.size}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="font-semibold text-amber-900 text-base mb-3">Shipping Options</Text>
            {Object.keys(shippingOptions).map((val, idx) => (
              <TouchableOpacity
                key={idx}
                className={`flex-row justify-between items-center p-3 border rounded-md mt-2 ${selectedShippingOption === idx ? 'border-amber-500 bg-amber-50' : 'border-amber-200'}`}
                onPress={() => setSelectedShippingOption(idx)}
              >
                <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedShippingOption === idx ? 'border-amber-600 bg-amber-600' : 'border-amber-400'}`}>
                        {selectedShippingOption === idx && <View className="w-2 h-2 rounded-full bg-white"/>}
                    </View>
                    <Text className={`text-sm ${selectedShippingOption === idx ? 'text-amber-800 font-medium' : 'text-amber-700'}`}>{shippingOptions[idx].label}</Text>
                </View>
                <Text className={`text-sm font-medium ${selectedShippingOption === idx ? 'text-amber-900' : 'text-amber-800'}`}>${shippingOptions[idx].cost.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="font-semibold text-amber-900 text-base">Payment Method</Text>
            </View>
            {paymentOptions.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                    className={`flex-row items-center p-3 border rounded-md mt-2 ${selectedPaymentOption === idx ? 'border-amber-500 bg-amber-50' : 'border-amber-200'}`}
                    onPress={() => setSelectedPaymentOption(idx)}
                >
                    <Feather name={paymentOptions[idx].icon === 'credit_card' ? "credit-card" : "dollar-sign"} size={20} color="#78350f" className="mr-3" />
                    <Text className="text-amber-800 text-sm">
                        {paymentOptions[idx].icon === 'credit_card' ? 'Visa **** **** **** 1234' : 'PayPal Account'}
                    </Text>
                </TouchableOpacity>

            ))}
          </View>


          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <Text className="font-semibold text-amber-900 text-base mb-3">Order Summary</Text>
            <View className="y-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-amber-700 text-sm">Subtotal</Text>
                <Text className="text-amber-900 text-sm">${subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-amber-700 text-sm">Shipping</Text>
                <Text className="text-amber-900 text-sm">${shippingCost.toFixed(2)}</Text>
              </View>

              <View className="my-2 bg-amber-200 h-[1px]" />
              <View className="flex-row justify-between">
                <Text className="text-amber-900 font-semibold text-base">Total</Text>
                <Text className="text-amber-900 font-semibold text-base">${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => {
            console.log("Order Placed:", {
                items: checkoutOrderItems,
                shippingAddress: "Suphasan, 254 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok, 10330, Thailand", 
                shippingOption: selectedShippingOption,
                paymentOption: selectedPaymentOption,
                subtotal,
                shippingCost,
                total
            });
            router.push('/order-confirmation');
          }}>
            <View className="bg-amber-500 rounded-lg p-4 shadow-sm mb-6">
              <Text className="text-center text-white font-semibold text-lg">Place Order</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}