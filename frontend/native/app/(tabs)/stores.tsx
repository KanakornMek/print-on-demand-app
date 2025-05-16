import React, { useCallback, useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useRouter } from 'expo-router';
import { canGoBack } from 'expo-router/build/global-state/routing';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';

interface Store {
    id: number;
    clerk_user_id: string;
    username: string;
    profile_image_url: string;
}

export default function StoresScreen() {
    const router = useRouter();
    const {getToken, userId} = useAuth();
    const { user } = useUser();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const [stores, setStores] = useState<Store[]>([]);


    useFocusEffect(
        useCallback(()=> {
            const fetchStores = async () => {
                try {
                    const token = await getToken();
                    const response = await fetch(`${apiUrl}/api/users`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    const data = await response.json();
                    console.log('Fetched stores:', data);
                    setStores(data.users);
                } catch (error) {
                    console.error('Error fetching stores:', error);
                }
            };
            fetchStores();
        }, [])
    )

    let me = {
        name: 'Alex',
        image: 'image',
        bio: 'BioBioBioBioBioBioBioBio'
    }

    let bio = [
        "Hello, I'm a designer",
        "I love to create beautiful things",
        "I love fashion and design",
        "I enjoy working with colors and shapes",
        "I am passionate about user experience",
        "I love to learn new things",
        "I am always looking for new challenges",
    ]

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
                                {(() => {
                                    const myStore = stores.find(store => store.clerk_user_id === user?.id);
                                    if (!myStore) return null;
                                    return (
                                        <TouchableOpacity onPress={() => router.push(`/store/${myStore.id}?bio=${encodeURIComponent(bio[6])}`)} className='items-center' >
                                            <View className='rounded-2xl w-full bg-white h-fit shadow-sm p-4 flex-row'>
                                                <View className='rounded-full size-[6rem] bg-slate-200 overflow-hidden justify-center items-center'>
                                                    <Image
                                                        source={user?.imageUrl || "https://placehold.co/80"}
                                                        style={{ width: 80, height: 80, borderRadius: 9999 }}
                                                        contentFit="cover"
                                                    />
                                                </View>
                                                <View className='w-fit h-[6rem] py-4 px-4 justify-center gap-2'>
                                                    <Text className="font-medium text-amber-900 text-base" >{user?.firstName}</Text>
                                                    <Text className="font-medium text-amber-900 text-base" >{bio[6]}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })()}
                                
                            </View>
                            <View className='py-4 gap-2'>
                                <Text className="font-medium text-amber-900 text-lg"> Following Stores</Text>
                                {stores.map((other,idx) => {
                                    if (other.clerk_user_id === userId) {
                                        return null;
                                    }
                                    return (
                                        <TouchableOpacity onPress={() => router.push(`/store/${other.id}?bio=${bio[idx]}`)} key={idx} className='items-center'>
                                            <View className='rounded-2xl w-full bg-white h-fit shadow-sm   p-4 flex-row'>
                                                <View className='rounded-full size-[6rem] bg-slate-200 overflow-hidden justify-center items-center'>
                                                    {/* <Text>{other.profile_image_url}</Text> */}
                                                    <Image 
                                                        source={ other.profile_image_url || "https://placehold.co/80"}
                                                        style={{ width: 80, height: 80, borderRadius: 9999 }}
                                                        contentFit='cover'
                                                        alt="Profile Image"
                                                    />
                                                </View>
                                                <View className='w-fit h-[6rem] py-4 px-4 justify-center gap-2'>
                                                    <Text className="font-medium text-amber-900 text-base" >{other.username}</Text>
                                                    <Text className="font-medium text-amber-900 text-base" >{bio[idx]}</Text>
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