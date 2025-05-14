import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canGoBack } from 'expo-router/build/global-state/routing';
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

const data = {
  image:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  name: 'Product Name',
  creatorName: 'Mr.Kanakorn',
  creatorProfileImage:
    'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  price: 590,
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
      text: 'very nice',
    },
    {
      name: 'Bob',
      rating: 4.5,
      text: 'best shirt ever',
    },
  ],
};

const avgRating =
  data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length;

enum Tabs {
  Description,
  Reviews,
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
    <View className="flex-row flex-wrap gap-2">
      {colors.map((color) => {
        const isActive = selectedColor === color;
        return (
          <Pressable
            key={color}
            onPress={() => handlePress(color)}
            className={`
              h-8 w-8 rounded-full border-2 transition-all
              ${isActive ? 'border-amber-500 ring-2 ring-amber-300' : 'border-amber-200'}
            `}
            style={{ backgroundColor: color }}>
            {/* <View
              className={`
                h-8 w-8 items-center justify-center rounded-full border-2
                ${isActive ? 'border-amber-500' : 'border-amber-200'}
              `}>
              <View className="h-7 w-7 rounded-full" style={{ backgroundColor: color }} />
            </View> */}
          </Pressable>
        );
      })}
    </View>
  );
};

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes = [], selectedSize, onSelectSize }) => {
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
          <Pressable
            key={size}
            onPress={() => handlePress(size)}
            className={`
              size-fit items-center justify-center overflow-hidden rounded-md border transition-all
              ${isActive ? 'border-amber-300' : 'border-amber-200'}
            `}>
            <View
              className={`h-8 w-fit items-center justify-center px-2 transition-all
                ${isActive ? 'bg-amber-100 text-amber-900' : 'bg-white text-amber-700'}`}>
              <Text
                className={`text-base transition-all ${isActive ? 'text-amber-900' : 'text-amber-700 '}`}>
                {' '}
                {size}{' '}
              </Text>
            </View>
          </Pressable>
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

  const [chosenColor, setChosenColor] = useState(data.colors[0]);
  const [chosenSize, setChosenSize] = useState(data.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(Tabs.Description);
  const [isFollowed, setIsFollowed] = useState(false);
  const handleColorSelection = (newColor: string) => {
    setChosenColor(newColor);
  };
  const handleSizeSelection = (newSize: string) => {
    setChosenSize(newSize);
  };

  return (
    // <View className="flex-1 items-center justify-center p-4 bg-white">
    //   {/* <Stack.Screen options={{ title: product.name }} /> */}
    //   <Stack.Screen options={{ title: `Product ${id}` }} />
    //   <Text className="text-3xl font-bold mb-4">Product Detail: ID {id}</Text>
    // </View>
    <SafeAreaView className="flex-1 bg-amber-400" edges={['top']}>
      <View className="amber-50 flex-1">
        {/* Header */}
        <View
          className="flex-row items-center bg-amber-400 px-4 py-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }}>
          <TouchableOpacity
            onPress={() => (canGoBack() ? router.back() : router.push('/(tabs)'))}
            className="mr-2 p-1">
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
          {/* <View className='bg-white size-10 rounded-full'></View>
          <Text className="font-semibold text-amber-900 text-lg"> Product Detail: ID {id} </Text> */}
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1">
          {/* Product Image */}
          <View className="flex items-center justify-center">
            <Image
              source={{ uri: data.image }}
              style={{ height: 256, width: '100%' }}
              resizeMode="cover"
            />
          </View>

          {/* Product Info */}
          <View className="bg-amber-50 p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-xl font-bold text-amber-900">{data.name} </Text>
              <Text className="text-xl font-bold text-amber-900">฿{data.price}</Text>
            </View>
            <View className="mb-4 flex-row gap-2">
              <View className="flex-row">
                {[...Array(5)].map((_, i) => (
                  <Text className={`${i + 1 <= avgRating ? 'text-amber-500' : 'text-gray-300'}`}>
                    ★
                  </Text>
                ))}
              </View>
              <Text className="text-sm text-amber-700">
                {avgRating.toFixed(1)} ({data.reviews.length} reviews)
              </Text>
            </View>

            <View className="gap-4">
              <View>
                {/* Color Options */}
                <Text className="mb-2 text-sm font-medium text-amber-900">Color</Text>
                <ColorSelector
                  colors={data.colors}
                  selectedColor={chosenColor}
                  onSelectColor={handleColorSelection}
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-amber-900">Size</Text>
                <SizeSelector
                  sizes={data.sizes}
                  selectedSize={chosenSize}
                  onSelectSize={handleSizeSelection}
                />
              </View>

              {/* Select quantity */}
              <View>
                <Text className="mb-2 text-sm font-medium text-amber-900">Quantity</Text>
                <View className="flex-row items-center self-start rounded-md border border-amber-300 bg-white">
                  <TouchableOpacity
                    className="size-8 items-center justify-center"
                    onPress={() => {
                      setQuantity(Math.max(quantity - 1, 1));
                    }}>
                    <Feather name="minus" size={16} color="#78350f" />
                  </TouchableOpacity>
                  <Text className="mx-2 w-8 text-center text-base text-amber-900">{quantity}</Text>
                  <TouchableOpacity
                    className="size-8 items-center justify-center"
                    onPress={() => {
                      setQuantity(quantity + 1);
                    }}>
                    <Feather name="plus" size={16} color="#78350f" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between border-y border-amber-300 bg-white p-4">
            <View className="flex-row items-center gap-4">
              <Image
                source={{ uri: data.creatorProfileImage }}
                style={{ width: 64, height: 64, borderRadius: 999 }}
              />
              <Text className="text-lg font-medium text-amber-900">{data.creatorName}</Text>
            </View>
            <Pressable onPress={()=>setIsFollowed(!isFollowed)} className="rounded-md border items-center justify-center border-amber-400 h-8 bg-white w-28">
              {isFollowed ? (
                <Text className="font-medium text-amber-900"><Feather name="check" size={15}/> Following</Text>
              ) : (
                <Text className="font-medium text-amber-900">Follow</Text>
              )}
            </Pressable>
          </View>
          {/* Tabs */}
          <View className="bg-amber-50 p-4">
            <View className="w-full flex-row items-center justify-center gap-1 self-center rounded-md bg-amber-200 p-1">
              <Pressable
                className={`h-8 flex-1 rounded p-1 text-center font-medium transition-all ${selectedTab == Tabs.Description ? 'bg-amber-400 text-amber-900' : 'text-gray-500'}`}
                onPress={() => setSelectedTab(Tabs.Description)}>
                Description
              </Pressable>
              <Pressable
                className={`h-8 flex-1 rounded p-1 text-center font-medium transition-all ${selectedTab == Tabs.Reviews ? 'bg-amber-400 text-amber-900' : 'text-gray-500'}`}
                onPress={() => setSelectedTab(Tabs.Reviews)}>
                Reviews
              </Pressable>
            </View>
            {selectedTab == Tabs.Description && (
              <View className="px-1.5">
                <Markdown style={{ body: { color: '#78350f', marginTop: 16 } }}>
                  {data?.description}
                </Markdown>
              </View>
            )}
            {selectedTab == Tabs.Reviews && (
              <View className="gap-3 pt-4">
                {data.reviews.map((review, i) => (
                  <View key={i} className="border-b border-amber-200 pb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-medium text-amber-900">{review.name}</Text>
                      <View className="flex-row">
                        {[...Array(5)].map((_, i) => (
                          <Text
                            key={i}
                            className={`${i + 1 <= review.rating ? 'text-amber-500' : 'text-gray-300'}`}>
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text className="mt-1 text-sm text-amber-900">{review.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        <View className="sticky bottom-0 flex-row items-center justify-between border-t border-amber-200 bg-white p-3">
          <View>
            <Text className="text-xs text-amber-700">Total Price</Text>
            <Text className="text-lg font-bold text-amber-900">฿{data.price}</Text>
          </View>
          <TouchableOpacity className="flex-row gap-2 rounded bg-amber-500 p-3">
            <Feather name="shopping-cart" color="white" size={16} />
            <Text className="font-medium text-white">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
