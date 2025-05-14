import { canGoBack } from "expo-router/build/global-state/routing";
import { TouchableOpacity, View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import ProductCard from '@/components/common/ProductCard';


export default function StoreDetailScreen() {
    const router = useRouter();
    let data = {
        username: 'john.smith',
        name: 'John Smith',
        image: 'img',
        followers: 12,
        following: 15,
        bio: 'BioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBioBio'
    }
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
    ]

    return (
        <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
            <View className="flex-1 bg-amber-50">
                <View className="bg-amber-400 px-4 py-3 flex-row items-center border-b border-amber-600" >
                    <TouchableOpacity onPress={() => canGoBack() ? router.back() : router.push('/(tabs)')} className="mr-2 p-1">
                        <Feather name="arrow-left" size={24} color="#78350f" />
                    </TouchableOpacity>
                </View>
                <View className="bg-amber-100 px-5 py-3 border-b gap-2 border-amber-600">
                    <View className='flex-row items-center my-2'>
                        <View className='rounded-full size-[6rem] bg-white overflow-hidden justify-center items-center'>
                            <Text>{data.image}</Text>
                        </View>
                        <View className='px-5 justify-between gap-2 w-fit'>
                            <Text className="font-medium text-amber-900 text-lg"> {data.name} </Text>
                            <View className='flex-row justify-between gap-2'>
                                <View>
                                    <Text className="font-medium text-amber-900 text-base"> 18 </Text>
                                    <Text className="font-normal text-amber-900 text-base"> designs </Text>
                                </View>
                                <View>
                                    <Text className="font-medium text-amber-900 text-base"> {data.followers} </Text>
                                    <Text className="font-normal text-amber-900 text-base"> followers </Text>
                                </View>
                                <View>
                                    <Text className="font-medium text-amber-900 text-base"> {data.following} </Text>
                                    <Text className="font-normal text-amber-900 text-base"> following </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text className="font-normal text-amber-900 text-base my-2">{data.bio}</Text>
                </View>
                <View className='flex-1 px-[16px] w-full items-center pt-[16px]'>
                    <FlatList
                        className='w-full flex-1'
                        columnWrapperClassName='justify-between items-center w-full'
                        numColumns={2}
                        data = {data0}
                        renderItem = { ({item}) => (
                            <ProductCard image={item.image} name={item.name} creator={item.creator} price={item.price}></ProductCard>
                            
                        )
                        } 
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}