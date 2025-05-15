import { canGoBack } from 'expo-router/build/global-state/routing';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/common/ProductCard';

export default function StoreDetailScreen() {
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
              <Text>{data.image}</Text>
            </View>
            <View className="px-5 justify-between gap-2 w-fit">
              <Text className="font-medium text-amber-900 text-lg">{data.name}</Text>
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
          <Text className="font-normal text-amber-900 text-base my-2">{data.bio}</Text>
        </View>

        {/* Product List */}
        <View className="flex-1 px-[16px] w-full items-center">
          <FlatList
            className="w-full flex-1 pt-[16px]"
            columnWrapperClassName="justify-between items-center w-full"
            numColumns={2}
            data={data0}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                image={item.image}
                name={item.name}
                creator={item.creator}
                price={item.price}
                onPress={() => router.push('/design/123')}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}