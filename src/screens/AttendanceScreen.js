import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { getAllCoe } from "../utils/storage";
import ScreenHeader from "../components/ScreenHeader";
import { getAttendance } from "../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function AttendanceScreen({ navigation }) {
  const [coes, setCoes] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const loadData = async () => {
    const coeData = await getAllCoe();
    const attData = await getAttendance();

    setCoes(coeData);
    setAttendance(attData);
    // console.log("Attendance Data:", attData);
  };

  const isMarked = (coeName) => {
    return attendance.some(
      (item) => item.coe === coeName && item.date === today,
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

const getTodayEntry = (coeId) => {
  return attendance.find(
    (item) => item.coeId === coeId && item.date === today
  );
};

 const renderItem = ({ item }) => {
  const entry = getTodayEntry(item.id);
  const isMarked = !!entry;

  return (
    <TouchableOpacity
      className={`p-4 rounded-xl mb-3 ${
        isMarked ? "bg-green-100 border border-green-300" : "bg-gray-50"
      }`}
      onPress={() =>
        !isMarked && navigation.navigate("AttendanceEntry", { coe: item })
      }
      disabled={isMarked}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-primary font-bold text-lg">
          {item.name}
        </Text>

        {isMarked && (
          <MaterialIcons name="check-circle" size={22} color="green" />
        )}
      </View>

      {isMarked ? (
        <View className="mt-2">
          <Text className="text-green-600 font-semibold text-sm">
            Added for today
          </Text>

          <Text className="text-green-800 text-sm mt-1">
            Present: {entry.present}
          </Text>
        </View>
      ) : (
        <Text className="text-gray-500 text-sm mt-1">
          Tap to mark attendance
        </Text>
      )}
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader title="Attendance" navigation={navigation} />

      <View className="px-4 mt-2 flex-1">
        <View className="bg-white rounded-2xl p-5 shadow flex-1">
          {/* Date */}
          <Text className="text-lg font-bold text-primary mb-4">
            Date: {today}
          </Text>

          {/* COE List */}
          <FlatList
            data={coes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
