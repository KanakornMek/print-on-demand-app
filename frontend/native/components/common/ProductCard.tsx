import { Image } from 'expo-image';
import { Pressable, TouchableOpacity, View , Text} from 'react-native';

interface Props {
    image: string;
    name: string;
    creator: string;
    price: number;
    onPress?: () => void;
}

export default function  ProductCard({image, name, creator, price, onPress} : Props) {
    return (
        <Pressable className={'rounded-3xl w-[48%] h-[16rem] border-solid overflow-hidden mb-[16px] shadow-sm'} onPress={onPress}>
            <View className='bg-slate-200 justify-center items-center h-[80%] w-full'>
                <Image 
                    source={image ||"https://placehold.co/100"}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 6,
                    }}
                    alt={name}
                    contentFit="cover"
                />
            </View>
            <View className='bg-white h-[20%] flex-row justify-between'>
                <View className='float-left w-[60%] justify-center pl-[1.5rem]'>
                    <Text className='text-amber-900 text-base/0 font-semibold truncate text-left'>{name}</Text>
                    <Text className='text-amber-900 text-xs truncate text-left'>{creator}</Text>
                </View>
                <View className='justify-center w-[40%] pr-[1.5rem] '>
                    <Text className='text-amber-900 text-base font-semibold text-right'>฿{price}</Text>
                </View>
            </View>
        </Pressable>
    )
}