import { canGoBack } from 'expo-router/build/global-state/routing';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

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

  return (
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="flex-1 bg-amber-50">
        <View className="flex-row items-center border-b border-amber-600 bg-amber-400 px-4 py-3">
          <TouchableOpacity
            onPress={() => (canGoBack() ? router.back() : router.push('/(tabs)'))}
            className="mr-2 p-1">
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
        </View>
        <View className="gap-2 border-b border-amber-600 bg-amber-100 px-5 py-3">
          <View className="my-2 flex-row items-center">
            <View className="size-[6rem] items-center justify-center overflow-hidden rounded-full bg-white">
              <Text>{data.image}</Text>
            </View>
            <View className="w-fit justify-between gap-2 px-5">
              <Text className="text-lg font-medium text-amber-900"> {data.name} </Text>
              <View className="flex-row justify-between gap-2">
                <View>
                  <Text className="text-base font-medium text-amber-900"> 18 </Text>
                  <Text className="text-base font-normal text-amber-900"> designs </Text>
                </View>
                <View>
                  <Text className="text-base font-medium text-amber-900"> {data.followers} </Text>
                  <Text className="text-base font-normal text-amber-900"> followers </Text>
                </View>
                <View>
                  <Text className="text-base font-medium text-amber-900"> {data.following} </Text>
                  <Text className="text-base font-normal text-amber-900"> following </Text>
                </View>
              </View>
            </View>
          </View>
          <Text className="my-2 text-base font-normal text-amber-900">{data.bio}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
