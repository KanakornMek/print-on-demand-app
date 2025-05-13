import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";
import Feather from '@expo/vector-icons/Feather';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import { FlatList } from 'react-native';
// import { Product } from '@/types/pod'; // Assuming you have a Product type

interface ColorSelectorProps {
  colors?: string[];
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors = [],
  selectedColor,
  onSelectColor,
}) => {
  const handlePress = (color: string) => {
    if (onSelectColor) {
      onSelectColor(color);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-3">
      {colors.map((color) => {
        const isActive = selectedColor === color;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => handlePress(color)}
            className={`
              rounded-full justify-center items-center
              ${isActive ? "w-9 h-9 border-2 border-amber-300" : "w-9 h-9 border-transparent border-2"}
            `}
          >
            <View
              className={`
                w-8 h-8 rounded-full border-2 justify-center items-center
                ${isActive ? "border-amber-500" : "border-amber-200"}
              `}
            >
              <View
                className="w-7 h-7 rounded-full"
                style={{ backgroundColor: color }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
 
  
  let data = {
    image: 'IMG',
    name: 'Product Name',
    rating: 3.6,
    colors: ['#ff0000', '#00ff00'],
  }
  const [chosenColor, setChosenColor] = useState(data.colors[0]);
  const handleColorSelection = (newColor:string) => {
    setChosenColor(newColor);
  };

  return (
    // <View className="flex-1 items-center justify-center p-4 bg-white">
    //   {/* <Stack.Screen options={{ title: product.name }} /> */}
    //   <Stack.Screen options={{ title: `Product ${id}` }} />
    //   <Text className="text-3xl font-bold mb-4">Product Detail: ID {id}</Text>
    // </View>
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
          {/* <View className='bg-white size-10 rounded-full'></View>
          <Text className="font-semibold text-amber-900 text-lg"> Product Detail: ID {id} </Text> */}
        </View>

        <ScrollView 
          className="flex-1"
        >
          <View className='bg-slate-400 justify-center items-center h-[20rem]'>
            <Text className='text-white'> {data.image} </Text>
          </View>
          <View className='bg-amber-50 p-4'>
            <Text className="font-semibold text-amber-900 text-xl"> {data.name} </Text>
            <ColorSelector colors={data.colors} selectedColor={chosenColor} onSelectColor={handleColorSelection} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}