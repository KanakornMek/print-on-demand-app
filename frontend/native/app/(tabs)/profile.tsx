import React, { use, useCallback } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Avatar from '@/components/common/Avatar';


interface Order {
  billing_address_id: number;
  created_at: string;
  id: string;
  items: {
    design_id: number;
    id: number;
    item_total: number;
    order_id: number;
    product_name_snapshot: string;
    quantity: number;
    unit_price_snapshot: number;
    variant_details_snapshot: string;
    variant_id: number;
  }[];
  payment_method: string;
  shipping_address_id: number;
  shipping_cost: number;
  shipping_option_name: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  tracking_number: string | null;
  updated_at: string;
  user_id: number;
}

export default function ProfileScreen() {
  const { isSignedIn, signOut, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [orders, setOrders] = React.useState<Order[]>([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${apiUrl}/api/orders`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          const res = await response.json();
          console.log('Fetched orders:', res);
          setOrders(res.data)
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
      fetchOrders();

      return () => {
        console.log('Cleanup function called');
      }
    }, [])
  )

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  if (!isSignedIn || !user) {
    router.replace('/(auth)/login');
    return(<React.Fragment />);
  }

  const menuItemsData: { iconName: "heart" | "credit-card" | "package" | "settings"; label: string; href: string }[] = [
    // { iconName: "heart", label: "Saved Designs", href: "/saved-designs" },
    { iconName: "credit-card", label: "Payment Methods", href: "/payment-methods" },
    { iconName: "package", label: "Shipping Addresses", href: "/addresses" },
    { iconName: "settings", label: "Settings", href: "/settings" },
  ];

  const ordersData = [
    { id: "ORD-1234", date: "May 10, 2023", status: "Delivered", items: 2 },
    { id: "ORD-5678", date: "April 25, 2023", status: "Processing", items: 1 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className='bg-white rounded-lg p-4 shadow-sm mb-6 items-center'>
          <Avatar imageUrl={user.imageUrl}/>
          <Text className='font-bold text-lg text-amber-900'>{user.fullName}</Text>
          <Text className='text-sm text-amber-700'>{user.primaryEmailAddress?.emailAddress}</Text>
          {/* <TouchableOpacity className='border border-amber-300 rounded-lg px-4 py-2 mt-4 flex-1 items-center justify-center'>
            <Text className='text-sm text-amber-900'>Edit Profile</Text>
          </TouchableOpacity> */}
        </View> 

        <View className='bg-white rounded-lg p-4 mb-6 shadow-sm'>
          <Text className="font-semibold text-amber-900 mb-3">My Orders</Text>
          <View className="y-3 gap-2">
            {orders.map((order,idx) => (
                <View key={idx} className="flex-row justify-between items-center p-3 border border-amber-200 rounded-lg active:bg-amber-100">
                  <View>
                    <Text className="font-medium text-amber-900">{order.id}</Text>
                    <Text className="text-xs text-amber-700">
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })} • {order.items.length} items
                    </Text>
                  </View>
                  <View>
                    <Text
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>
            ))}
          </View>
          {/* <TouchableOpacity className="py-2 px-4 rounded-md flex items-center justify-center bg-transparent w-full mt-3">
            <Text className="text-amber-700">View All Orders</Text>
          </TouchableOpacity> */}
        </View>
        <View className="bg-white rounded-lg shadow-sm">
          <View className="p-2">
            {menuItemsData.map((item, index) => {
              return (
                <Link href={item.href} key={index} asChild>
                  <TouchableOpacity className="flex-row items-center p-3 active:bg-amber-100 rounded-lg">
                    <View className="mr-3">
                      <Feather name={item.iconName} size={20} color="#b45309" />
                    </View>
                    <Text className="text-amber-900">{item.label}</Text>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </View>
          <View className="h-[1px] bg-amber-200" />
          <View className="p-2">
            <TouchableOpacity 
              className="w-full justify-start items-center flex-row bg-transparent active:bg-red-50  py-2 px-4 rounded-md flex"
              onPress={handleSignOut}
            >
              <Feather name="log-out" size={20} className="mr-3" color="#dc2626"/>
              <Text className="text-red-600">Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      
      </ScrollView> 

    </SafeAreaView>
    
  );
}


// export default function ProfileScreen() {
//   const { isSignedIn, signOut } = useAuth();
//   const { user } = useUser();
//   const router = useRouter();

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       router.replace('/(auth)/login');
//     } catch (err) {
//       console.error("Sign out error", err);
//     }
//   };

//   if (!isSignedIn || !user) {
//     return (
//       <View className="flex-1 items-center justify-center p-4">
//         <Text className="text-lg mb-4">You are not signed in.</Text>
//         <Button title="Go to Login" onPress={() => router.push('/(auth)/login')} />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 items-center justify-center bg-white p-4">
//       <Text className="text-2xl font-bold mb-4">Profile</Text>
//       <Text className="text-lg mb-2">Email: {user.primaryEmailAddress?.emailAddress}</Text>
//       <Text className="text-lg mb-2">First Name: {user.firstName || 'Not set'}</Text>
//       <Text className="text-lg mb-4">Last Name: {user.lastName || 'Not set'}</Text>
//       <Button title="Sign Out" onPress={handleSignOut} color="red" />
//     </View>
//   );
// }