import { useRouter, useLocalSearchParams, Link } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { canGoBack } from "expo-router/build/global-state/routing";
import { useState } from "react";

const savedAddresses = [
    //254 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok, 10330, Thailand

  {
    id: 'addr1',
    name: 'Suphasan',
    addressLine1: '254 Phaya Thai Rd',
    addressLine2: 'Wang Mai, Pathum Wan',
    city: 'Bangkok',
    zipCode: '10330',
    country: 'Thailand',
    isDefault: true,
  },
  {
    id: 'addr2',
    name: 'John Doe',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'New York',
    zipCode: '10001',
    country: 'United States',
    isDefault: false,
  },
  {
    id: 'addr3',
    name: 'Jane Smith',
    addressLine1: '456 Elm St',
    addressLine2: '',
    city: 'Los Angeles',
    zipCode: '90001',
    country: 'United States',
    isDefault: false,
  }
];

export default function AddressSelection() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const initialSelectedAddressId = params.currentAddressId || savedAddresses.find(addr => addr.isDefault)?.id;

  const [selectedAddressId, setSelectedAddressId] = useState(initialSelectedAddressId);

  const handleSelectAddress = (addressId: any) => {
    setSelectedAddressId(addressId);
  };

  const handleConfirmSelection = () => {
    if (selectedAddressId) {
      if (canGoBack()) {
        router.back();
      } else {
        router.push({ pathname: '/checkout', params: { selectedAddressId: selectedAddressId }}); 
      }
    } 
  };

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
          <TouchableOpacity
            onPress={() => canGoBack() ? router.back() : router.push('/checkout')}
            className="mr-2 p-1"
          >
            <Feather name="arrow-left" size={24} color="#78350f" />
          </TouchableOpacity>
          <Text className="font-semibold text-amber-900 text-lg">Select Shipping Address</Text>
        </View>

        <ScrollView
          className="flex-1"
        >
          <View className="p-4">
            <Link href="/add-new-address" asChild>
              <TouchableOpacity className="bg-amber-500 p-3 rounded-lg mb-6 flex-row items-center justify-center shadow-sm">
                <Feather name="plus-circle" size={20} color="white" className="mr-2" />
                <Text className="text-white font-semibold text-base">Add New Address</Text>
              </TouchableOpacity>
            </Link>

            {/* List of Saved Addresses */}
            <Text className="font-semibold text-amber-900 text-base mb-3">Saved Addresses</Text>
            {savedAddresses.length > 0 ? (
              savedAddresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  className={`bg-white rounded-lg p-4 shadow-sm mb-3 border-2 ${selectedAddressId === address.id ? 'border-amber-500' : 'border-transparent'}`}
                  onPress={() => handleSelectAddress(address.id)}
                >
                  <View className="flex-row items-center mb-1">
                    {selectedAddressId === address.id ? (
                      <Feather name="check-circle" size={20} color="#c27803" className="mr-2"/>
                    ) : (
                      <Feather name="circle" size={20} color="#fbbf24" className="mr-2"/>
                    )}
                    <Text className="font-medium text-amber-900 flex-1" numberOfLines={1}>{address.name}</Text>
                    {address.isDefault && selectedAddressId !== address.id && (
                        <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                            <Text className="text-amber-700 text-xs font-medium">Default</Text>
                        </View>
                    )}
                  </View>
                  <View className="ml-7">
                    <Text className="text-amber-800 text-sm">{address.addressLine1}</Text>
                    {address.addressLine2 && <Text className="text-amber-800 text-sm">{address.addressLine2}</Text>}
                    <Text className="text-amber-800 text-sm">{`${address.city}, ${address.zipCode}`}</Text>
                    <Text className="text-amber-800 text-sm">{address.country}</Text>
                  </View>
                  <View className="flex-row justify-end mt-2">
                    <Link href={{ pathname: "/edit-address", params: { addressId: address.id } }} asChild>
                        <TouchableOpacity className="p-1">
                            <Text className="text-amber-600 text-sm font-medium">Edit</Text>
                        </TouchableOpacity>
                    </Link>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center py-8 bg-white rounded-lg shadow-sm">
                <Feather name="map-pin" size={28} color="#f59e0b" className="mb-3"/>
                <Text className="text-amber-800 text-base mb-1">No saved addresses found.</Text>
                <Text className="text-amber-700 text-sm">Add an address to get started.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}