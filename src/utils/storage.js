import * as FileSystem from "expo-file-system/legacy";

const COE_FILE = FileSystem.documentDirectory + "coes.json";
const ATTENDANCE_FILE = FileSystem.documentDirectory + "attendance.json";

// Save COE
export const saveCoe = async (newCoe) => {
  try {
    let existing = await getAllCoe();

    const updated = [...existing, newCoe];

    await FileSystem.writeAsStringAsync(
      COE_FILE,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.log("Error saving COE:", error);
  }
};

// Get all COE
export const getAllCoe = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(COE_FILE);

    if (!fileInfo.exists) return [];

    const data = await FileSystem.readAsStringAsync(COE_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading COE:", error);
    return [];
  }
};

// Save attendance
export const saveAttendance = async (newEntry) => {
  try {
    let existing = await getAttendance();

    const updated = [...existing, newEntry];

    await FileSystem.writeAsStringAsync(
      ATTENDANCE_FILE,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.log("Error saving attendance:", error);
  }
};

// Get attendance
export const getAttendance = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(ATTENDANCE_FILE);

    if (!fileInfo.exists) return [];

    const data = await FileSystem.readAsStringAsync(ATTENDANCE_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading attendance:", error);
    return [];
  }
};