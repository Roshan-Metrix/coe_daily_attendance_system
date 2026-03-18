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

    // Create cards
    const cards = data.map((item) => {
      return `
        <div class="card">
          <div class="card-header">
            ${item.coeName}
          </div>

          <div class="card-body">
            <p class="present">Present: ${item.present}</p>

            ${
              item.imageUri
                ? `<img src="${item.imageUri}" class="image" />`
                : `<div class="no-image">No Image</div>`
            }
          </div>
        </div>
      `;
    });

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 16px;
              background: #f5f6fa;
            }

            .header {
              text-align: center;
              margin-bottom: 20px;
            }

            .title {
              font-size: 22px;
              font-weight: bold;
              color: #0B0C5E;
            }

            .date {
              font-size: 14px;
              color: #555;
              margin-top: 4px;
            }

            /* GRID */
            .grid {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
            }

            .card {
              width: 48%;
              background: #ffffff;
              border-radius: 10px;
              margin-bottom: 14px;
              border: 1px solid #e5e7eb;
              overflow: hidden;
            }

            .card-header {
              background: #0B0C5E;
              color: white;
              padding: 10px;
              font-weight: bold;
              font-size: 14px;
            }

            .card-body {
              padding: 10px;
            }

            .present {
              font-size: 13px;
              margin-bottom: 8px;
              color: #111;
            }

            .image {
              width: 100%;
              height: 120px;
              object-fit: cover;
              border-radius: 6px;
            }

            .no-image {
              height: 120px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f3f4f6;
              color: #888;
              border-radius: 6px;
              font-size: 12px;
            }
          </style>
        </head>

        <body>

          <!-- HEADER -->
          <div class="header">
            <div class="title">COE Attendance Report</div>
            <div class="date">Date: ${date}</div>
          </div>

          <!-- GRID -->
          <div class="grid">
            ${cards.join("")}
          </div>

        </body>
      </html>
    `;

    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });

    const fileName = `COE_Attendance_${date}.pdf`;
    const newPath = FileSystem.documentDirectory + fileName;

    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });

    // AUTO OPEN
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