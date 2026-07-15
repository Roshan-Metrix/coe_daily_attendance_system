import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Camera Permission
    const cameraPermission =
      await ImagePicker.requestCameraPermissionsAsync();

    // Media Library Permission
    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted) {
      if (!cameraPermission.canAskAgain) {
        alert("Please enable Camera permission from Settings.");
        Linking.openSettings();
      }
    }

    if (!mediaPermission.granted) {
      if (!mediaPermission.canAskAgain) {
        alert("Please enable Media Library permission from Settings.");
        Linking.openSettings();
      }
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

// import "./global.css";
// import AppNavigator from "./src/navigation/AppNavigator";
// import { StatusBar } from 'expo-status-bar';

// export default function App() {
//   return (
//     <>
//       <StatusBar style="dark" /> 
//       <AppNavigator />
//     </>
//   );
// }