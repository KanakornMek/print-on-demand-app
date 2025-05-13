import { View } from "react-native";
import { Image } from "expo-image";

export default function Avatar({ imageUrl }: { imageUrl: string }) {
    return (
        <View className="rounded-full overflow-hidden mb-3">
            <Image
                source={imageUrl || "https://placehold.co/80"}
                style={{ width: 80, height: 80 }}
                contentFit="cover"
            />
        </View>
    );
}