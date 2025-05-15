import React from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { canGoBack } from 'expo-router/build/global-state/routing';


export default function StoresScreen() {
    const router = useRouter();

    let me = {
        name: 'Alex',
        image: 'image',
        bio: 'BioBioBioBioBioBioBioBio'
    }
    let others = [
        {
            name: 'Brandon',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
        {
            name: 'Charles',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
        {
            name: 'Brandon',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
        {
            name: 'Charles',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
        {
            name: 'Brandon',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
        {
            name: 'Charles',
            image: 'image',
            bio: 'BioBioBioBioBioBioBioBio'
        },
    ]

    return (
        <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
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
                        <TouchableOpacity onPress={() => canGoBack() ? router.back() : router.push('/(tabs)')} className="mr-2 p-1">
                        <Feather name="arrow-left" size={24} color="#78350f" />
                        </TouchableOpacity>
                        <Text className="font-semibold text-amber-900 text-lg">Stores</Text>
                    </View>
                    <ScrollView>
                        <View className='px-[16px]'>
                            <View className='py-4 gap-2'>
                                <Text className="font-medium text-amber-900 text-lg"> My Store </Text>
                                <TouchableOpacity onPress={() => router.push('/store')} className='items-center' >
                                    <View className='rounded-2xl w-full bg-white h-fit shadow-sm p-4 flex-row'>
                                        <View className='rounded-full size-[6rem] bg-slate-200 overflow-hidden justify-center items-center'>
                                            <Text>{me.image}</Text>
                                        </View>
                                        <View className='w-fit h-[6rem] py-4 px-4 justify-center gap-2'>
                                            <Text className="font-medium text-amber-900 text-base" >{me.name}</Text>
                                            <Text className="font-medium text-amber-900 text-base" >{me.bio}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                
                            </View>
                            <View className='py-4 gap-2'>
                                <Text className="font-medium text-amber-900 text-lg"> Following Stores</Text>
                                {others.map((other,idx) => {
                                    return (
                                        <TouchableOpacity onPress={() => router.push('/store/123')} key={idx} className='items-center'>
                                            <View className='rounded-2xl w-full bg-white h-fit shadow-sm   p-4 flex-row'>
                                                <View className='rounded-full size-[6rem] bg-slate-200 overflow-hidden justify-center items-center'>
                                                    <Text>{other.image}</Text>
                                                </View>
                                                <View className='w-fit h-[6rem] py-4 px-4 justify-center gap-2'>
                                                    <Text className="font-medium text-amber-900 text-base" >{other.name}</Text>
                                                    <Text className="font-medium text-amber-900 text-base" >{other.bio}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </View>
        </SafeAreaView>
    )
    
}