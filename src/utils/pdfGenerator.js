import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

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

export const generatePDF = async (data, date, setLoading) => {
  try {
    setLoading(true);

    if (!data || data.length === 0) {
      alert("No data found");
      setLoading(false);
      return;
    }

    // Create cards for HTML
    const cards = await Promise.all(
      data.map(async (item) => {
        const base64Image = item.imageUri ? await getBase64Image(item.imageUri) : null;
        return `
          <div class="card">
            <div class="card-header">${item.coeName}</div>
            <div class="card-body">
              <p>Total Present: ${item.present}</p>
              ${
                base64Image
                  ? `<img src="${base64Image}" class="image" />`
                  : `<div>No Image</div>`
              }
            </div>
          </div>
        `;
      })
    );

    // Build HTML content
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 16px; }
            .grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
            .card { width: 48%; border: 1px solid #ddd; border-radius: 10px; margin-bottom: 12px; }
            .card-header { background: #0B0C5E; color: #fff; padding: 8px; font-weight: bold; }
            .card-body { padding: 8px; }
            .image { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; }
            .no-image { height: 120px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; color:#888; border-radius:6px; font-size:12px; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;">COE Attendance</h2>
          <h4 style="text-align:center;">CIT, Chennai</h4>
          <p style="text-align:center;">Date: ${date} AD</p>
          <div class="grid">${cards.join("")}</div>
        </body>
      </html>
    `;

    // Preview PDF
    await Print.printAsync({ html });

    // Generate PDF file
    const { uri } = await Print.printToFileAsync({ html });

    // Rename PDF to COE_date.pdf
    const fileName = `COE_${date}.pdf`;
    const newPath = FileSystem.documentDirectory + fileName;

    await FileSystem.moveAsync({ from: uri, to: newPath });

    // Save to Downloads on Android
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to save PDF");
        setLoading(false);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(newPath);

      // Try both possible album names
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