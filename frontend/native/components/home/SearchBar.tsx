import React from 'react';
import react, { TextInput , View, Text} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function SearchBar({placeholder}:{placeholder:string}) {
    // const [search, setSearch] = React.useState('');

    return (
        // copied from login
        <View className="items-start gap-2 w-[95vw] mt-3 mb-1">
            <View className="relative w-full">
                <Feather
                    className="absolute left-4 top-6 z-10 -translate-y-1/2"
                    name="search"
                    size={18}
                    color="#b45309"
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder={placeholder}
                    className="h-12 w-full rounded-full border border-amber-300 bg-white px-4 pl-11 text-base text-amber-900 focus:ring-amber-500"
                    placeholderTextColor={'#fbbf24'}
                />
                <Feather
                    className="absolute right-4 top-6 z-10 -translate-y-1/2"
                    name="filter"
                    size={18}
                    color="#fbbf24"
                />
            </View>
        </View>
    );
}