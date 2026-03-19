import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import ScreenHeader from "../components/ScreenHeader";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";

export default function PdfListScreen({ navigation }) {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [sortLatest, setSortLatest] = useState(true);

  const loadFiles = async () => {
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required");
        return;
      }

      let pdfFiles = [];

      //  Try fetching from Downloads album
      const album =
        (await MediaLibrary.getAlbumAsync("Download")) ||
        (await MediaLibrary.getAlbumAsync("Downloads"));

      if (album) {
        const media = await MediaLibrary.getAssetsAsync({
          album,
          mediaType: "unknown",
          first: 500, // increase to get more files
        });

        pdfFiles = media.assets.filter((item) =>
          item.filename?.toLowerCase().endsWith(".pdf")
        );
      }

      // ALSO fetch from app's local storage (reliable)
      const localFiles = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const localPdfs = localFiles
        .filter((f) => f.toLowerCase().endsWith(".pdf"))
        .map((f) => ({
          filename: f,
          uri: FileSystem.documentDirectory + f,
          id: f, 
          creationTime: Date.now(), 
        }));

      // Merge both lists
      setFiles([...localPdfs, ...pdfFiles]);
    } catch (err) {
      console.log("Load PDF error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  // SEARCH FILTER
  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sortedFiles = filteredFiles.sort((a, b) =>
    sortLatest
      ? b.creationTime - a.creationTime
      : a.creationTime - b.creationTime
  );

  // SHARE
  const handleShare = async (file) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing not available");
      return;
    }

    await Sharing.shareAsync(file.uri || file.localUri, {
      mimeType: "application/pdf",
      dialogTitle: "Share PDF",
    });
  };

  const handleDelete = (file, loadFiles) => {
  Alert.alert(
    "Delete PDF",
    `Are you sure you want to delete "${file.filename}"?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // If it's a MediaLibrary asset
            if (file.id && file.uri) {
              await MediaLibrary.deleteAssetsAsync([file.id]);
            } 
            // If it's a local file in documentDirectory
            else if (file.filename) {
              const fileUri = FileSystem.documentDirectory + file.filename;
              const exists = await FileSystem.getInfoAsync(fileUri);
              if (exists.exists) {
                await FileSystem.deleteAsync(fileUri, { idempotent: true });
              }
            }

            // Refresh the list
            loadFiles();
          } catch (err) {
            console.log("Delete error:", err);
            alert("Delete failed");
          }
        },
      },
    ]
  );
};

  const openFile = async (file) => {
  try {
    const uri =
      file.uri || file.localUri || FileSystem.documentDirectory + file.filename;

    if (Platform.OS === "android") {
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: uri,
        flags: 1,
        type: "application/pdf",
      });
    } else {
      await Print.printAsync({ uri });
    }
  } catch (err) {
    console.log("Open PDF error:", err);
    Alert.alert(
      "Error",
      "Cannot open PDF. Make sure a PDF viewer is installed on your device."
    );
  }
};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader title="Saved PDFs" navigation={navigation} />

      <View className="px-4 mt-2">
        {/* SEARCH BAR */}
        <TextInput
          placeholder="Search PDFs..."
          value={search}
          onChangeText={setSearch}
          className="bg-white p-5 rounded-xl border border-gray-200 mb-3"
        />

        {/* SORT BUTTON */}
        <TouchableOpacity
          onPress={() => setSortLatest(!sortLatest)}
          className="ml-2 flex-row items-center"
        >
          <MaterialIcons name="sort" size={25} color="#0B0C5E" />
          <Text className="ml-2 text-primary font-semibold text-base">
            Sort: {sortLatest ? "Latest First" : "Oldest First"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedFiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-5">
            <MaterialIcons name="picture-as-pdf" size={60} color="gray" />
            <Text className="text-gray-500 mt-4 text-lg">No PDFs found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openFile(item)}
            className="bg-white p-3 rounded-2xl mb-4 border border-gray-200"
          >
            <View className="flex-row items-center">
              {/* PDF ICON */}
              <MaterialIcons name="picture-as-pdf" size={42} color="#DC2626" />

              {/* FILE INFO */}
              <View className="ml-4 flex-1">
                <Text className="text-primary font-bold text-lg">{item.filename}</Text>
                <Text className="text-gray-500 text-sm">
                  {new Date(item.creationTime).toLocaleString()}
                </Text>
              </View>

              {/* ACTION BUTTONS */}
              <View className="flex-row">
                {/* SHARE */}
                <TouchableOpacity onPress={() => handleShare(item)} className="mr-3">
                  <MaterialIcons name="share" size={24} color="#0B0C5E" />
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <MaterialIcons name="delete" size={26} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}