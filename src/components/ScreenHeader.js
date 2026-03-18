import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ScreenHeader({ title, navigation }) {
  return (
   <View className="flex-row items-center justify-between bg-primary px-4 py-5  mb-4">
  
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <MaterialIcons name="arrow-back" size={26} color="white" />
  </TouchableOpacity>

  <Text className="text-xl font-bold text-white">
    {title}
  </Text>

  <View style={{ width: 26 }} />
</View>
  );
}