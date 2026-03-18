import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import HomeScreen from "../screens/HomeScreen";
import AddCoeScreen from "../screens/AddCoeScreen";
import ViewAllCoeScreen from "../screens/ViewAllCoeScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import ExportDataScreen from "../screens/ExportDataScreen";
import AttendanceEntryScreen from "../screens/AttendanceEntryScreen";
import PdfListScreen from "../screens/PdfListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddCoe" component={AddCoeScreen} />
        <Stack.Screen name="ViewAllCoe" component={ViewAllCoeScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="ExportData" component={ExportDataScreen} />
        <Stack.Screen name="AttendanceEntry" component={AttendanceEntryScreen} />
        <Stack.Screen name="PdfList" component={PdfListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
