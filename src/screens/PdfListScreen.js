import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import ScreenHeader from "../components/ScreenHeader";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function PdfListScreen({ navigation }) {
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    const dir = FileSystem.documentDirectory;
    const fileList = await FileSystem.readDirectoryAsync(dir);

    const pdfs = fileList.filter((file) => file.endsWith(".pdf"));
    setFiles(pdfs);
  };

  // refresh every time screen opens
  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const openFile = async (file) => {
    const uri = FileSystem.documentDirectory + file;

    try {
      await IntentLauncher.startActivityAsync(
        "android.intent.action.VIEW",
        {
          data: uri,
          flags: 1,
          type: "application/pdf",
        }
      );
    } catch (err) {
      alert("No app found to open PDF");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader title="Saved PDFs" navigation={navigation} />

      <FlatList
        data={files}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}

        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <MaterialIcons name="picture-as-pdf" size={60} color="gray" />
            <Text className="text-gray-500 mt-4 text-lg">
              No PDFs found
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openFile(item)}
            className="bg-white p-6 rounded-2xl mb-4 border border-gray-200 flex-row items-center"
          >
            {/* Icon */}
            <MaterialIcons
              name="picture-as-pdf"
              size={40}
              color="#DC2626"
            />

            {/* File Name */}
            <View className="ml-4 flex-1">
              <Text className="text-primary font-bold text-lg">
                {item}
              </Text>

              <Text className="text-gray-500 text-base">
                Tap to open
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}