import { canGoBack } from 'expo-router/build/global-state/routing';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import ProductCard from '@/components/common/ProductCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';
import { Image } from 'expo-image';


interface Design {
  id: number;
  name: string;
  final_product_image_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  product_id: number;
  product_details: {
    id: number;
    name: string;
    description: string;
    image_url: string;
    base_price: number;
    category_id: number;
  };
  creator_name: string;
}


export default function StoreDetailScreen() {
  const { id, bio } = useLocalSearchParams<{ id: string, bio?: string }>();
  const [isStoreOwner, setIsStoreOwner] = useState(false);


  const { getToken, userId } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const { user } = useUser();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [store, setStore] = useState({
    id: 0,
    clerk_user_id: '',
    username: '',
    profile_image_url: '',
  });

  useEffect(() => {
    if(userId === store.clerk_user_id){
      setIsStoreOwner(true);
    }

  }, [store])

  useFocusEffect(
    useCallback(() => {
      const fetchStore = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${apiUrl}/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const res = await response.json();
          console.log('Fetched store:', res);
          setStore(res);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      }
      
      fetchStore();
      return () => {
        console.log('Cleanup function called');
      }
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      const fetchDesigns = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${apiUrl}/api/designs/user/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const res = await response.json();
          console.log('Fetched designs:', res.data);
          setDesigns(res.data);
        } catch (error) {
          console.error('Error fetching designs:', error);
        }
      };
      fetchDesigns();
      return () => {
        console.log('Cleanup function called');
      }
    }
    , [])
  )


  const router = useRouter();
  let data = {
    username: 'john.smith',
    name: 'John Smith',
    image: 'img',
    followers: 12,
    following: 15,
    bio: 'BioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBio',
  };

  const data0 = [
    // dummy items to prevent FlatList crash
    { id: '1', image: 'img1', name: 'Design 1', creator: 'john.smith', price: 100 },
    { id: '2', image: 'img2', name: 'Design 2', creator: 'john.smith', price: 150 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="flex-1 bg-amber-50">
        {/* Header */}
        <View className="bg-amber-400 px-4 py-3 flex-row items-center border-b border-amber-600">
          <TouchableOpacity
            onPress={() => (canGoBack() ? router.back() : router.push('/(tabs)'))}
            className="mr-2 p-1"
          >
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="bg-amber-100 px-5 py-3 border-b gap-2 border-amber-600">
          <View className="flex-row items-center my-2">
            <View className="rounded-full size-[6rem] bg-white overflow-hidden justify-center items-center">
              <Image
                source={store?.profile_image_url || "https://placehold.co/80"}
                style={{ width: 80, height: 80, borderRadius: 9999 }}
                contentFit="cover"
                alt="Profile Image"
              />
            </View>
            <View className="px-5 justify-between gap-2 w-fit">
              <Text className="font-medium text-amber-900 text-lg">{store.username}</Text>
              <View className="flex-row justify-between gap-2">
                <View>
                  <Text className="font-medium text-amber-900 text-base">18</Text>
                  <Text className="font-normal text-amber-900 text-base">designs</Text>
                </View>
                <View>
                  <Text className="font-medium text-amber-900 text-base">{data.followers}</Text>
                  <Text className="font-normal text-amber-900 text-base">followers</Text>
                </View>
                <View>
                  <Text className="font-medium text-amber-900 text-base">{data.following}</Text>
                  <Text className="font-normal text-amber-900 text-base">following</Text>
                </View>
              </View>
            </View>
          </View>
          <Text className="font-normal text-amber-900 text-base my-2">{bio}</Text>
        </View>

        {/* Product List */}
        <View className="flex-1 px-[16px] w-full items-center">
          <FlatList
            className="w-full flex-1 pt-[16px]"
            columnWrapperClassName="justify-between items-center w-full"
            numColumns={2}
            data={designs}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ProductCard
                image={item.final_product_image_url}
                name={item.name}
                creator={item.creator_name}
                price={item.product_details.base_price}
                onPress={() => router.push(`/design/123`)}
              />
            )}
          />
          {isStoreOwner && (
            <TouchableOpacity
              className="size-[36] bg-amber-500 absolute bottom-5 right-5 rounded-full overflow-hidden items-center justify-center"
              onPress={() => router.push(`/design`)}
            >
              <Feather name="plus" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}