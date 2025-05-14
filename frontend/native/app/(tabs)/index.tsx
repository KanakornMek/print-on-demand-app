import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Link, router, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { FlatList } from 'react-native';
import ProductCard from '@/components/common/ProductCard';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Rochester_400Regular } from '@expo-google-fonts/rochester';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Rochester_400Regular,
  });

  // dummy data
  let data0 = [
    {
      image : 'img',
      name: 'Name',
      creator: 'Creator',
      price: 100
    },
    {
      image : 'img2',
      name: 'Name2',
      creator: 'Creator2',
      price: 50
    },
    {
      image : 'img3',
      name: 'name3',
      creator: 'creator3',
      price: 150
    },
    {
      image : 'img4',
      name: 'name4',
      creator: 'creator4',
      price: 250
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="flex-1 items-center justify-center bg-amber-50 ">
      {/* <Text className="text-2xl font-bold mb-4">Welcome to the Home Screen!</Text>
      {user && <Text className="text-lg mb-2">Hello, {user.firstName || user.primaryEmailAddress?.emailAddress}!</Text>}
      <Link href="/product/123" asChild>
        <Button title="Go to Product 123" />
      </Link>
      <View className="my-2" />
      <Link href="/(auth)/login" asChild>
        <Button title="Go to Login (if not logged in)" />
      </Link> */}

      <View 
        className="bg-amber-400 px-4 py-3 flex-row items-center w-full"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2, 
        }}
      >
        <Text style={{ fontFamily: 'Rochester_400Regular'}} className='text-amber-900 text-2xl font-semibold'> SnapPress </Text>
      </View>
      
      <View className="items-start gap-2 w-[95vw] mt-3 mb-2">
            <View className="relative w-full">
                <Feather
                    className="absolute left-4 top-6 z-10 -translate-y-1/2"
                    name="search"
                    size={18}
                    color="#b45309"
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder='Search design or name...'
                    className="h-12 w-full rounded-full border border-amber-300 bg-white px-4 pl-11 text-base text-amber-900 focus:ring-amber-500"
                    placeholderTextColor={'#fbbf24'}
                />
                <Feather
                    className="absolute right-4 top-6 z-10 -translate-y-1/2"
                    name="filter"
                    size={18}
                    color="#fbbf24"
                />
            </View>
      </View>

      <FlatList
        className='w-screen'
        columnWrapperClassName='justify-around'
        numColumns={2}
        data = {data0}
        renderItem = { ({item}) => (
            <ProductCard image={item.image} name={item.name} creator={item.creator} price={item.price}></ProductCard>
          )
        } 
       />
    </View>
    </SafeAreaView>
    
  );
}