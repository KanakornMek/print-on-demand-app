import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";
import Feather from '@expo/vector-icons/Feather';
// import { Product } from '@/types/pod'; // Assuming you have a Product type
import Markdown from 'react-native-markdown-display';
// import ReadMore from 'react-native-read-more-text';

interface ColorSelectorProps {
  colors?: string[];
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

interface SizeSelectorProps {
  sizes?: string[];
  selectedSize?: string;
  onSelectSize: (size: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors = [],
  selectedColor,
  onSelectColor,
}) => {
  const handlePress = (color: string) => {
    if (onSelectColor) {
      onSelectColor(color);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-3 pl-2">
      {colors.map((color) => {
        const isActive = selectedColor === color;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => handlePress(color)}
            className={`
              rounded-full justify-center items-center
              ${isActive ? "w-9 h-9 border-2 border-amber-300" : "w-9 h-9 border-transparent border-2"}
            `}
          >
            <View
              className={`
                w-8 h-8 rounded-full border-2 justify-center items-center
                ${isActive ? "border-amber-500" : "border-amber-200"}
              `}
            >
              <View
                className="w-7 h-7 rounded-full"
                style={{ backgroundColor: color }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes = [],
  selectedSize,
  onSelectSize,
}) => {
  const handlePress = (size: string) => {
    if (onSelectSize) {
      onSelectSize(size);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-3 pl-2">
      {sizes.map((size) => {
        const isActive = selectedSize === size;
        return (
          <TouchableOpacity
            key={size}
            onPress={() => handlePress(size)}
            className={`
              rounded-md justify-center items-center overflow-hidden size-fit border-2
              ${isActive ? "border-amber-300" : "border-amber-200"}
            `}
          >

              <View
                className={`w-fit h-8 justify-center items-center px-2
                ${isActive ? "bg-amber-100" : "bg-white"}`}  
              > 
                <Text className='text-base'> {size} </Text>
              </View>
            
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


export default function ProductDetailScreen() {
  // const { id } = useLocalSearchParams<{ id: string }>();
  // const [product, setProduct] = React.useState<Product | null>(null);
  // const [loading, setLoading] = React.useState(true);
  // const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
 
  
  let data = {
    image: 'IMG',
    name: 'Product Name',
    rating: 3.6,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: `## Minimalist Himalayan Peaks T-Shirt

Find your inner peace and connection to the world's highest peaks with this thoughtfully designed t-shirt. The striking centerpiece is a minimalist white line drawing that elegantly captures the majestic silhouette of the Himalayan mountain range. This subtle yet powerful graphic evokes a sense of adventure, resilience, and the breathtaking beauty of nature.

**Key Features:**

* **Design:** Clean, minimalist white line drawing of the Himalayan mountain range.
* **Print:** High-quality print with a slightly textured white ink for added depth.
* **Shirt Color:** Classic black, providing a striking contrast to the white design.
* **Neckline:** Comfortable and versatile crew neck.
* **Material:** Crafted from premium, soft-touch cotton for all-day comfort.
* **Fit:** Carefully considered fit for a timeless and flattering silhouette.
* **Durability:** Pre-shrunk to minimize shrinkage and maintain its shape after washing.
* **Inspiration:** Perfect for those who appreciate nature, adventure, and understated design.

Whether you're an avid hiker, a lover of the outdoors, or simply appreciate clean and meaningful design, this Minimalist Himalayan Peaks T-Shirt is a versatile addition to your wardrobe. Wear it on your next adventure or as a daily reminder of the awe-inspiring power of the natural world.`,
    reviews: [
      {
        name: 'Alice',
        rating: 4,
        text: 'very nice'
      },
      {
        name: 'Bob',
        rating: 4.5,
        text: 'best shirt ever'
      }
    ]
  };

  const [chosenColor, setChosenColor] = useState(data.colors[0]);
  const [chosenSize, setChosenSize] = useState(data.sizes[0]);
  const handleColorSelection = (newColor:string) => {
    setChosenColor(newColor);
  };
  const handleSizeSelection = (newSize:string) => {
    setChosenSize(newSize);
  };

  return (
    // <View className="flex-1 items-center justify-center p-4 bg-white">
    //   {/* <Stack.Screen options={{ title: product.name }} /> */}
    //   <Stack.Screen options={{ title: `Product ${id}` }} />
    //   <Text className="text-3xl font-bold mb-4">Product Detail: ID {id}</Text>
    // </View>
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
          {/* <View className='bg-white size-10 rounded-full'></View>
          <Text className="font-semibold text-amber-900 text-lg"> Product Detail: ID {id} </Text> */}
        </View>

        <ScrollView 
          className="flex-1"
        >
          <View className='bg-white justify-center items-center h-[20rem]'>
            <Text className='text-black'> {data.image} </Text>
          </View>
          <View className='bg-amber-50 px-5'>
            <Text className="font-semibold text-amber-900 text-xl pt-4 pb-3"> {data.name} </Text>
            {/* <View className='gap-2 py-2 bg-red-500 inline-block relative w-fit'>
              
              <View className='absolute top-0 z-0'>
                <Text className=''> ★★★★★ </Text>
              </View>
              <View className='absolute top-0 overflow-hidden w-[50%] z-1'>
                <Text className=' text-amber-400 overflow-hidden text-clip text-nowrap relative'> ★★★★★ </Text>
              </View>
            </View> */}
            <View className='gap-2 py-2'>
              <Text className="font-normal text-amber-900 text-base"> Color </Text>
              <ColorSelector colors={data.colors} selectedColor={chosenColor} onSelectColor={handleColorSelection} />
            </View>
            <View className='gap-2 py-2'>
              <Text className="font-normal text-amber-900 text-base"> Size </Text>
              <SizeSelector sizes={data.sizes} selectedSize={chosenSize} onSelectSize={handleSizeSelection} />
            </View>
            <View className='gap-2 py-2'>
              <Text className="font-normal text-amber-900 text-base"> Quantity </Text>
              <View className="flex-row items-center justify-between p-2">
                <View className="flex-row items-center border border-amber-300 rounded-md bg-white">
                  <TouchableOpacity
                    className="size-9 items-center justify-center p-0"
                    onPress={() => {}}
                  >
                    <Feather name='minus' size={16} color='#78350f'/>
                  </TouchableOpacity>
                  <Text className="w-8 text-center text-base text-amber-900 mx-2">{5}</Text>
                  <TouchableOpacity
                    className="size-9 items-center justify-center p-0"
                    onPress={() => {}}
                  >
                    <Feather name='plus' size={16} color='#78350f'/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className='px-1.5'>
              <Markdown style={{body:{color:'#78350f', marginTop:16}}}>{data?.description}</Markdown>
            </View>
            <View className="my-2 bg-amber-200 h-[1px]"/>
            <View className='gap-2 py-2'>
              <Text className="font-normal text-amber-900 text-base"> Reviews </Text>
            </View>
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}