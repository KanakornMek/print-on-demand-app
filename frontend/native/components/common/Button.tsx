import { TouchableOpacity, Text } from 'react-native';
interface Props {
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button({ text, onPress, disabled=false }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full items-center rounded-md ${disabled? "bg-amber-500/40":"bg-amber-500"} py-2`}
      disabled={disabled}>
      <Text className="text-lg font-semibold text-white">{text}</Text>
    </TouchableOpacity>
  );
}