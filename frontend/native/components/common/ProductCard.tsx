import { Pressable, TouchableOpacity, View , Text} from 'react-native';

interface Props {
    image: string;
    name: string;
    creator: string;
    price: number;
    onPress?: () => void;
}

export default function ProductCard({image, name, creator, price, onPress} : Props) {
    return (
        <Pressable className={'rounded-3xl w-[48%] h-[16rem] border-solid overflow-hidden mb-[16px] shadow-sm'} onPress={onPress}>
            <View className='bg-slate-200 justify-center items-center h-[80%]'>
                <Text> {image} </Text>
            </View>
            <View className='bg-white h-[20%] flex-row justify-between'>
                <View className='float-left justify-center pl-[1.2rem]'>
                    <Text className='text-amber-900 text-base/0 font-semibold'> {name} </Text>
                    <Text className='text-amber-900 text-xs'> {creator} </Text>
                </View>
                <View className='justify-center pr-[1.2rem]'>
                    <Text className='text-amber-900 text-base font-semibold'> ฿{price} </Text>
                </View>
            </View>
        </Pressable>
    )
}