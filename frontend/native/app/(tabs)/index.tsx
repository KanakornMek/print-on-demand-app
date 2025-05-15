import React, {useState, useCallback} from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Link, router, useFocusEffect, useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { FlatList } from 'react-native';
import ProductCard from '@/components/common/ProductCard';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Rochester_400Regular } from '@expo-google-fonts/rochester';

interface Designs {
  id: number;
  name: string;
  final_product_image_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  product_details: {
    id: number;
    name: string;
    description: string;
    image_url: string;
    base_price: number;
    category_id: number;
  };
  variant_id: number;
  variant_details: {
    id: number;
    product_id: number;
    color: string;
    size: string;
    image_url: string;
    price_modifier: number;
    stock_quantity: number;
    stock_status: string;
  };
  creator_name: string;
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;


  let [fontsLoaded] = useFonts({
    Rochester_400Regular,
  });

  const [designs, setDesigns] = useState<Designs[]>([]);

  useFocusEffect(useCallback(() => {
    const fetchDesigns = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${apiUrl}/api/designs`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        const res = await response.json();
        console.log('Fetched designs:', res);
        setDesigns(res.data);
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
    }
    fetchDesigns();
    return () => {
      console.log('Cleanup function called');
    }
  }, []));


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
      <View className="flex-1 items-center bg-amber-50">
        <View className="w-full px-[16px] py-[16px]">
          <View className="items-center w-full p-[16px] gap-4 bg-amber-300 rounded-xl">
            <Text style={{ fontFamily: 'Rochester_400Regular'}} className='text-amber-900 text-4xl font-semibold'> SnapPress </Text>
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
        </View>
        <View className='flex-1 px-[16px] w-full items-center'>
          <FlatList
              className='w-full flex-1'
              columnWrapperClassName='justify-between items-center w-full'
              numColumns={2}
              data = {designs}
              renderItem = { ({item}) => (
                  <ProductCard image={item.final_product_image_url} name={item.name} creator={item.creator_name} price={item.product_details.base_price} onPress={()=>{router.push(`/product/${item.id}`)}}></ProductCard>
                  
                )
              } 
          />
        </View>
          
      </View>
    </SafeAreaView>
    
  );
}