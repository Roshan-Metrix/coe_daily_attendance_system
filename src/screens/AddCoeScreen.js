import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { saveCoe } from "../utils/storage";
import ScreenHeader from "../components/ScreenHeader";

export default function AddCoeScreen({ navigation }) {
  const [coeName, setCoeName] = useState("");
  const [incharge, setIncharge] = useState("");

  const handleSave = async () => {
    if (!coeName || !incharge) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const newCoe = {
      id: Date.now(),
      name: coeName,
      incharge: incharge,
    };

    await saveCoe(newCoe);

    setCoeName("");
    setIncharge("");

    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">

      {/* Header */}
      <ScreenHeader title="Add COE" navigation={navigation} />

      <View className="px-4 mt-2">

        {/* Form Card */}
        <View className="bg-white rounded-2xl p-5 shadow">

          {/* Title */}
          <Text className="text-xl font-bold text-primary mb-4">
            Add New COE
          </Text>

          {/* COE Name */}
          <Text className="text-gray-600 mb-1 text-sm">
            COE Name
          </Text>
          <TextInput
            value={coeName}
            onChangeText={setCoeName}
            placeholder="Enter COE Name"
            placeholderTextColor="#94a3b8"
            className="bg-gray-100 p-4 rounded-xl mb-4 text-base"
          />

          {/* Incharge */}
          <Text className="text-gray-600 mb-1 text-sm">
            COE Incharge
          </Text>
          <TextInput
            value={incharge}
            onChangeText={setIncharge}
            placeholder="Enter Incharge Name"
            placeholderTextColor="#94a3b8"
            className="bg-gray-100 p-4 rounded-xl mb-6 text-base"
          />

          {/* Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary p-4 rounded-xl shadow"
          >
            <Text className="text-white text-center text-base font-semibold">
              Save COE
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
}