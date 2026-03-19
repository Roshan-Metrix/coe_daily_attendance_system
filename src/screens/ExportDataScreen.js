import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { getAttendance } from "../utils/storage";
import { generatePDF } from "../utils/pdfGenerator";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingOverlay } from "../components/LoadingOverlay";

export default function ExportDataScreen({ navigation }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false); 
  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  const handleTodayExport = async () => {
    const allData = await getAttendance();
    const today = formatDate(new Date());

    const filtered = allData.filter((item) => item.date === today);

    await generatePDF(filtered, today, setLoading); 
  };

  const handleDateExport = async (date) => {
    const allData = await getAttendance();
    const formatted = formatDate(date);

    const filtered = allData.filter((item) => item.date === formatted);

    await generatePDF(filtered, formatted, setLoading);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">

      <ScreenHeader title="Export Data" navigation={navigation} />

      <View className="px-4 mt-5">

        {/* TODAY CARD */}
        <TouchableOpacity
          onPress={handleTodayExport}
          className="bg-primary p-6 rounded-3xl mb-5 shadow-lg"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-xl font-bold">
                Today Attendance
              </Text>
              <Text className="text-white/80 mt-1">
                Export today's report instantly
              </Text>
            </View>

            <MaterialIcons name="picture-as-pdf" size={30} color="white" />
          </View>
        </TouchableOpacity>

        {/* DATE PICKER CARD */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="bg-white p-6 rounded-3xl shadow"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-primary text-xl font-bold">
                Select Date
              </Text>
              <Text className="text-gray-500 mt-1">
                Export report by choosing date
              </Text>
            </View>

            <MaterialIcons name="calendar-month" size={30} color="#0B0C5E" />
          </View>
        </TouchableOpacity>

      </View>

      {/* LOADING OVERLAY */}
      {loading && <LoadingOverlay />}

      {/* MODAL CALENDAR */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">

          <View className="bg-white p-5 rounded-t-3xl">

            <Text className="text-lg font-bold text-primary mb-3 text-center">
              Select Date
            </Text>

            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowPicker(false);
                  handleDateExport(date);
                } else {
                  setShowPicker(false);
                }
              }}
            />

          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}