import { useState } from 'react';
import { Button, Image, View, TouchableOpacity, Text, Pressable, TextInput, Platform, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { canGoBack } from 'expo-router/build/global-state/routing';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '@clerk/clerk-expo';

export default function ImagePickerExample() {
const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [resImage, setResImage] = useState<string | null>(null);
  const [designName, setDesignName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const { getToken } = useAuth();
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('design_image', {
      uri: image,
      name: 'design.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/print-on-shirt`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      setResImage(data.imageUrl);

      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/designs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: designName,
          description: description,
          final_product_image_url: data.imageUrl,
          product_id: 1
        }),
      });
      if(!res.ok) {
        console.error('Error saving design:', res.statusText);
        const errData = await res.json();
        console.error('Error details:', errData);
        return;
      }
      const resData = await res.json();
      console.log('Design saved:', resData);
      console.log("Design created successfully");


      router.push(`/preview/${encodeURIComponent(data.imageUrl)}`);


      console.log('Upload success:', data);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-amber-50" edges={['top']}>
        <KeyboardAwareScrollView className="flex-1 bg-amber-50" 
          enableAutomaticScroll={true}
          enableOnAndroid={true}
          extraScrollHeight={50}
        >
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
                <TouchableOpacity onPress={() => canGoBack() ? router.back() : router.push('/(tabs)/home')} className="mr-2 p-1">
                <Feather name="arrow-left" size={24} color="#78350f" />
                </TouchableOpacity>
                <Text className="font-semibold text-amber-900 text-lg">Edit Designs</Text>
            </View>
            <View className='p-[16] gap-5'>
                <View className='gap-3'>
                    <Text className='font-medium text-amber-900 text-xl'>Design Image</Text>
                    <View className='items-center'>
                        <Pressable onPress={pickImage} className='rounded-2xl size-fit items-center'>
                            <View className='h-[300px] w-[300] rounded-2xl border-2 border-dashed border-amber-500 items-center justify-center bg-white'>
                                {(image==null) ? <View className='h-[250] w-[250] items-center justify-center gap-3'>
                                    <Feather name="upload" size={36} color="#b45309"/>
                                    <Text className='font-normal text-amber-700 text-lg'>Click to upload image</Text>
                                </View> : (image && (
                                    <View className='size-full items-center justify-center'>
                                        <Image source={{ uri: image }} style={{width:250, height:250}} resizeMode='contain'/>
                                        <View className='size-[36] bg-amber-500 absolute bottom-5 right-5 rounded-full overflow-hidden items-center justify-center'>
                                            <Feather name="edit" size={22} color="#fff"/>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Pressable>
                    </View>
                </View>
                <View className='gap-3'>
                    <Text className='font-medium text-amber-900 text-xl'>Design Name</Text>
                    <TextInput 
                        className='px-4 py-2 w-full h-[2.5rem] align-top bg-white rounded-xl border border-amber-500'
                        placeholder='Enter Design description'
                        placeholderTextColor="grey"
                        onChangeText={(text) => {
                          setDesignName(text);
                          
                        }}
                    /> 
                </View>
                <View className='gap-3'>
                    <Text className='font-medium text-amber-900 text-xl'>Description</Text>
                    <TextInput 
                        className='px-4 py-[0.4rem] w-full h-[5rem] align-top bg-white rounded-xl border border-amber-500 overflow-visible' 
                        placeholder='Enter Design name'
                        placeholderTextColor="grey"
                        multiline={true}
                        onChangeText={(text) => {
                          setDescription(text);
                        }}
                    />
                </View>
                <View className='items-center'>
                    <TouchableOpacity
                        className={`w-full items-center rounded-md bg-amber-400 py-2`}
                        onPress={async () => {
                            await handleImageUpload()
                          }
                        }
                        activeOpacity = {0.35}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-lg font-medium text-white"> Save Design </Text>
                        )}
                    </TouchableOpacity>  
                </View>

            </View>
            
        </View>
        </KeyboardAwareScrollView>
        
    </SafeAreaView>
    
  );
}
