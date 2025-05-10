import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
// import { Product } from '@/types/pod'; // Assuming you have a Product type

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <View className="flex-1 items-center justify-center p-4 bg-white">
      {/* <Stack.Screen options={{ title: product.name }} /> */}
      <Stack.Screen options={{ title: `Product ${id}` }} />
      <Text className="text-3xl font-bold mb-4">Product Detail: ID {id}</Text>
    </View>
  );
}