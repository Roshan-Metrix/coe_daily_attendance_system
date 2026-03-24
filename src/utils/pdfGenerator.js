import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import { getCITlogo } from "../lib/LOGO";

// Convert image URI to Base64
const getBase64Image = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.log("Base64 conversion failed:", err);
    return null;
  }
};

// chunk helper
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const generatePDF = async (data, date, setLoading) => {
  try {
    setLoading(true);

    const CIT_LOGO = await getCITlogo();

    if (!data || data.length === 0) {
      alert("No data found");
      setLoading(false);
      return;
    }

    // Create cards
    const cards = await Promise.all(
      data.map(async (item) => {
        const base64Image = item.imageUri
          ? await getBase64Image(item.imageUri)
          : null;

        return `
          <div class="card">
            <div class="card-header">
              <div style="font-weight:800;font-size:17px;">${item.coeName}</div>
              <div style="font-weight:600;font-size:15px;">Total Present: ${item.present}</div>
            </div>
            <div class="date-time">
              <div>Date : ${item.date}</div>
              <div>Time : ${item.time}</div>
            </div>
            <div class="card-body">
              ${
                base64Image
                  ? `<img src="${base64Image}" class="image" />`
                  : `<div class="no-image">No Image</div>`
              }
            </div>
          </div>
        `;
      })
    );

    // pagination logic
    const firstPageCards = cards.slice(0, 6);
    const remainingCards = cards.slice(6);
    const otherChunks = chunkArray(remainingCards, 8);
    const totalPages = 1 + otherChunks.length;

    // HTML
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            padding: 20px;
            background: #f9fafb;
            color: #111827;
            margin: 0;
          }

          h3 {
            margin: 2px 0;
            font-size: 22px;
            font-weight: 800;
            text-align:center;
          }

          p {
            margin: 6px 0;
          }

          .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 12px;
          }

          .card {
            width: 48%;
            border-radius: 10px;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            break-inside: avoid;
          }

          .card-header {
            background: linear-gradient(135deg, #0B0C5E, #1d4ed8);
            color: #ffffff;
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
          }

          .date-time {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            font-size: 13px;
            background: #f3f4f6;
          }

          .card-body {
            padding: 10px 12px;
          }

          .image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
          }

          .no-image {
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            color: #9ca3af;
          }

          /* page break */
          .page:not(:last-child) {
            page-break-after: always;
          }

          /* footer */
          .footer {
          text-align: right;
          margin-top: 10px;
          font-size: 12px;
          color: #555;
          font-weight: 800;
          }

          /* margin for other pages */
          .other-page {
            margin-top: 10px;
          }
        </style>
      </head>

      <body>

        <!-- FIRST PAGE -->
        <div class="page">
          <div>
            <img src="${CIT_LOGO}" style="width:450px; margin:-10px 0 0 -10px;" />
          </div>

          <h3>COE Attendance</h3>

          <p>Date: ${date}</p>

          <p style="font-size:15px;">
            <u>Note:</u> This is not the actual attendance count. It represents the number of students present during the visit by the Office of CoE.
          </p>

          <div class="grid">
            ${firstPageCards.join("")}
          </div>

          <div class="footer">Page 1 of ${totalPages}</div>
        </div>

        <!-- OTHER PAGES -->
        ${otherChunks
          .map(
            (chunk, index) => `
            <div class="page other-page">
              <div class="grid">
                ${chunk.join("")}
              </div>
              <div class="footer">Page ${index + 2} of ${totalPages}</div>
            </div>
          `
          )
          .join("")}

      </body>
    </html>
    `;

    // Preview
    await Print.printAsync({ html });

    // Generate file
    const { uri } = await Print.printToFileAsync({ html });

    const fileName = `COE_${date}.pdf`;
    const newPath = FileSystem.documentDirectory + fileName;

    await FileSystem.moveAsync({ from: uri, to: newPath });

    // Save to Downloads (Android)
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required");
        setLoading(false);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(newPath);

      let album =
        (await MediaLibrary.getAlbumAsync("Download")) ||
        (await MediaLibrary.getAlbumAsync("Downloads"));

      if (!album) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    }

    setLoading(false);
  } catch (error) {
    console.log("PDF generation error:", error);
    setLoading(false);
    alert("PDF generation failed");
  }
};