import { Pressable, TouchableOpacity, View , Text} from 'react-native';

interface Props {
    image: string;
    name: string;
    creator: string;
    price: number;
}

export default function ProductCard({image, name, creator, price} : Props) {
    return (
        <Pressable className={'rounded-3xl w-[45vw] h-[16rem] border-solid overflow-hidden mt-[2.5vw] mb-[2.5vw] shadow-md'}>
            <View className='bg-amber-200 justify-center items-center h-[80%]'>
                <Text> {image} </Text>
            </View>
            <View className='bg-white h-[20%] flex-row justify-between'>
                <View className=' float-left justify-center pl-[1.2rem]'>
                    <Text className='text-base/0 font-semibold'> {name} </Text>
                    <Text className='text-xs'> {creator} </Text>
                </View>
                <View className='justify-center pr-[1.2rem]'>
                    <Text className='text-base font-semibold'> ฿{price} </Text>
                </View>
            </View>
        </Pressable>
    )
}