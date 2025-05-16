import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import { canGoBack } from "expo-router/build/global-state/routing";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";


export default function PreviewScreen() {
    const { encodedUrl } = useLocalSearchParams<{ encodedUrl : string }>();
    const decodedUrl = decodeURIComponent(encodedUrl as string);
    const url = decodedUrl ? { uri: decodedUrl } : null;

    const { getToken } = useAuth();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;




    
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-amber-50" edges={['top']}>
            <View className="flex-1 bg-amber-50">
                <View 
                    className="bg-amber-400 px-4 py-3 flex-row items-center"
                    style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2, 
                    }}
                >
                    <TouchableOpacity onPress={() => router.push('/(tabs)')} className="mr-2 p-1">
                    <Feather name="arrow-left" size={24} color="#78350f" />
                    </TouchableOpacity>
                    <Text className="font-semibold text-amber-900 text-lg">Go Back Home</Text>
                </View>
                <View className='flex-1 items-center gap-5 p-[16]'>
                    <Text className='font-medium text-amber-900 text-xl'>Product Preview</Text>
                    <View className='items-center'>
                        <Image 
                            source={url || 'https://placehold.co/100' }
                            style={{ height:300, width:300 , position:'absolute', zIndex:0}}
                        />
                    </View>
                </View>
                <View className='flex-1 items-center px-[16]'>
                    <TouchableOpacity
                        className={`w-full justify-center gap-2 rounded-md bg-amber-400 py-2 flex-row`}
                        onPress={
                            () => {router.push('/(tabs)')}
                        }
                        activeOpacity = {0.35}
                    >
                        <Feather name="home" size={24} color="#fff"/>
                        <Text className="text-lg font-medium text-white float-right">Home</Text>
                    </TouchableOpacity>  
                </View> 
            </View>
        </SafeAreaView>
    )
}