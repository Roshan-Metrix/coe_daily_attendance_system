import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

export const getCITlogo = async () => {
  const asset = Asset.fromModule(require("../../assets/CIT_LOGO.png"));
  await asset.downloadAsync();

  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/png;base64,${base64}`;
};
