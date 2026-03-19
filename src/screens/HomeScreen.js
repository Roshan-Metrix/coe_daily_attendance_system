import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {

  const Card = ({ title, icon, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="w-[48%] bg-white rounded-2xl p-5 mb-4 shadow"
    >
      <MaterialIcons name={icon} size={45} color="rgb(11, 12, 94)" />
      <Text className="mt-3 text-base font-semibold text-gray-800">
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">

      {/* Header */}
      <View className="bg-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <Text className="text-white text-xl font-semibold">
          Welcome !
        </Text>

        <Text className="text-white text-3xl font-bold mt-1">
          COE Attendance
        </Text>
      </View>

      {/* Cards Section */}
      <View className="flex-1 px-4 mt-[20px]">

        <View className="flex-row flex-wrap justify-between">

          <Card
            title="Add COES"
            icon="add-box"
            onPress={() => navigation.navigate("AddCoe")}
          />

          <Card
            title="View All COE"
            icon="view-list"
            onPress={() => navigation.navigate("ViewAllCoe")}
          />

          <Card
            title="Attendance"
            icon="fact-check"
            onPress={() => navigation.navigate("Attendance")}
          />

          <Card
            title="Export Data"
            icon="picture-as-pdf"
            onPress={() => navigation.navigate("ExportData")}
          />

          <Card
            title="Saved PDFs"
            icon="save"
            onPress={() => navigation.navigate("PdfList")}
          />

        </View>

      </View>

    </SafeAreaView>
  );
}