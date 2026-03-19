import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import ScreenHeader from "../components/ScreenHeader";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";

export default function PdfListScreen({ navigation }) {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [sortLatest, setSortLatest] = useState(true);

  const loadFiles = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Permission required");
        return;
      }

      const album = await MediaLibrary.getAlbumAsync("Download");

      if (!album) {
        setFiles([]);
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: "unknown",
        first: 100,
      });

      const pdfs = media.assets.filter((item) =>
        item.filename?.toLowerCase().endsWith(".pdf")
      );

      setFiles(pdfs);
    } catch (err) {
      console.log(err);
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
  const sortedFiles = filteredFiles.sort((a, b) => {
    return sortLatest
      ? b.creationTime - a.creationTime
      : a.creationTime - b.creationTime;
  });

  // SHARE
  const handleShare = async (file) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing not available");
      return;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share PDF",
    });
  };

  // DELETE
const handleDelete = (file) => {
  Alert.alert(
    "Delete PDF",
    `Are you sure you want to delete "${file.filename}"?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await MediaLibrary.deleteAssetsAsync([file.id]);
            loadFiles(); // refresh list
          } catch (err) {
            alert("Delete failed");
          }
        },
      },
    ]
  );
};

  // OPEN
  const openFile = async (file) => {
    await handleShare(file); // reuse share as open
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader title="Saved PDFs" navigation={navigation} />

      <View className="px-4 mt-2">

        {/*  SEARCH BAR */}
        <TextInput
          placeholder="Search PDFs..."
          value={search}
          onChangeText={setSearch}
          className="bg-white p-5 rounded-xl border border-gray-200 mb-3"
        />

        {/* SORT BUTTON */}
        <TouchableOpacity
          onPress={() => setSortLatest(!sortLatest)}
          className="mb-3 ml-2 flex-row items-center"
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
            <Text className="text-gray-500 mt-4 text-lg">
              No PDFs found
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openFile(item)}
            className="bg-white p-5 rounded-2xl mb-4 border border-gray-200"
          >
            <View className="flex-row items-center">

              {/* PDF ICON */}
              <MaterialIcons
                name="picture-as-pdf"
                size={40}
                color="#DC2626"
              />

              {/* FILE INFO */}
              <View className="ml-4 flex-1">
                <Text className="text-primary font-bold text-lg">
                  {item.filename}
                </Text>

                <Text className="text-gray-500 text-sm">
                  {new Date(item.creationTime).toLocaleString()}
                </Text>
              </View>

              {/* ACTION BUTTONS */}
              <View className="flex-row">

                {/* SHARE */}
                <TouchableOpacity
                  onPress={() => handleShare(item)}
                  className="mr-3"
                >
                  <MaterialIcons name="share" size={24} color="#0B0C5E" />
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>

              </View>

            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}