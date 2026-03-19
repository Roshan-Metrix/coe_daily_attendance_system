import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

const getBase64Image = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch {
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

    const cards = await Promise.all(
      data.map(async (item) => {
        const base64Image = item.imageUri
          ? await getBase64Image(item.imageUri)
          : null;

        return `
          <div class="card">
            <div class="card-header">${item.coeName}</div>
            <div class="card-body">
              <p>Present: ${item.present}</p>
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

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 16px; }
            .grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
            .card { width: 48%; border: 1px solid #ddd; border-radius: 10px; margin-bottom: 12px; }
            .card-header { background: #0B0C5E; color: #fff; padding: 8px; }
            .card-body { padding: 8px; }
            .image { width: 100%; height: 120px; object-fit: cover; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;">COE Attendance</h2>
          <p style="text-align:center;">Date: ${date}</p>
          <div class="grid">${cards.join("")}</div>
        </body>
      </html>
    `;

    await Print.printAsync({ html });

    //  GENERATE FILE
    const { uri } = await Print.printToFileAsync({ html });

    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Permission required to save PDF");
        setLoading(false);
        return;
      }

      // Create asset
      const asset = await MediaLibrary.createAssetAsync(uri);

      // Create or get Downloads album
      const album = await MediaLibrary.getAlbumAsync("Download");

      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      alert("PDF saved to Downloads");
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("PDF failed");
  }
};