import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { FlatList } from 'react-native';
import SearchBar from '@/components/home/SearchBar';
import ProductCard from '@/components/common/ProductCard';
// import { useFonts, Rochester_400Regular } from '@expo-google-fonts/rochester';

export default function HomeScreen() {
  const { user } = useUser();

  // let [fontsLoaded] = useFonts({
  //   Rochester_400Regular,
  // });

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
    <View className="flex-1 items-center justify-center bg-amber-100 ">
      {/* <Text className="text-2xl font-bold mb-4">Welcome to the Home Screen!</Text>
      {user && <Text className="text-lg mb-2">Hello, {user.firstName || user.primaryEmailAddress?.emailAddress}!</Text>}
      <Link href="/product/123" asChild>
        <Button title="Go to Product 123" />
      </Link>
      <View className="my-2" />
      <Link href="/(auth)/login" asChild>
        <Button title="Go to Login (if not logged in)" />
      </Link> */}

      {/* <View className='w-screen bg-amber-300 h-[4.5rem] items-start justify-center pl-[1rem]'>
        <Text style={{ fontFamily: 'Rochester_400Regular', fontSize: 30, color:'#ffffff' }}> SnapPress </Text>
      </View> */}

      <SearchBar placeholder='Search design or name...'></SearchBar>

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
  );
}