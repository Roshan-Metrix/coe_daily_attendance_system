import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";

export const generatePDF = async (data, date) => {
  try {
    if (!data || data.length === 0) {
      alert("No data found for this date");
      return;
    }

    const rows = data.map((item) => {
      return `
        <div style="margin-bottom:20px; padding:10px; border:1px solid #ccc; border-radius:8px;">
          <h3>${item.coeName}</h3>
          <p><strong>Present:</strong> ${item.present}</p>
          ${
            item.imageUri
              ? `<img src="${item.imageUri}" style="width:100%; height:200px; object-fit:cover;" />`
              : `<p>No Image</p>`
          }
        </div>
      `;
    });

    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1 style="text-align:center;">COE CIT ATTENDANCE</h1>
          <h3>Date: ${date}</h3>
          ${rows.join("")}
        </body>
      </html>
    `;

    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });

    const fileName = `COE_Attendance_${date}.pdf`;
    const newPath = FileSystem.documentDirectory + fileName;

    // Save file
    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });

    console.log("Saved at:", newPath);

    //  AUTO OPEN
    if (Platform.OS === "android") {
      await IntentLauncher.startActivityAsync(
        "android.intent.action.VIEW",
        {
          data: newPath,
          flags: 1,
          type: "application/pdf",
        }
      );
    } else {
      alert("PDF saved! Open from Files app.");
    }

  } catch (error) {
    console.log("PDF Error:", error);
    alert("Failed to generate PDF");
  }
};