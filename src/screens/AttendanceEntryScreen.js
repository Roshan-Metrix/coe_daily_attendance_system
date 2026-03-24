import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import ScreenHeader from "../components/ScreenHeader";
import { saveAttendance } from "../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function AttendanceEntryScreen({ route, navigation }) {
  const { coe } = route.params;

  const [present, setPresent] = useState("");
  const [image, setImage] = useState(null);

  const todayDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });


  const currTime = new Date().toLocaleTimeString("en-CA", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true
});


  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!present || !image) {
      Alert.alert("Error", "All fields required");
      return;
    }

    const entry = {
      date: todayDate,
      time: currTime,
      coeId: coe.id,
      coeName: coe.name,
      present: Number(present),
      imageUri: image,
    };

    await saveAttendance(entry);

    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">

      <ScreenHeader title={coe.name} navigation={navigation} />

      <View className="px-4 mt-5">

        {/* PRESENT INPUT CARD */}
        <View className="bg-white p-5 rounded-2xl mb-4 border border-gray-200">
          <Text className="text-primary font-bold text-lg mb-2">
            Present Students
          </Text>

          <TextInput
            placeholder="Enter number of students"
            keyboardType="numeric"
            value={present}
            onChangeText={setPresent}
            className="bg-gray-100 p-4 rounded-xl text-base"
          />
        </View>

        {/* IMAGE CARD */}
        <TouchableOpacity
          onPress={pickImage}
          className="bg-white p-5 rounded-2xl mb-4 border border-gray-200"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-primary font-bold text-lg">
                Capture Image
              </Text>
              <Text className="text-gray-500 mt-1">
                Take attendance photo
              </Text>
            </View>

            <MaterialIcons name="camera-alt" size={28} color="#0B0C5E" />
          </View>
        </TouchableOpacity>

        {/* PREVIEW */}
        {image && (
          <View className="bg-white p-3 rounded-2xl mb-4 border border-gray-200">
            <Image
              source={{ uri: image }}
              className="w-full h-44 rounded-xl"
            />
          </View>
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Save Attendance
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}