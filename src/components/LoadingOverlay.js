import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export const LoadingOverlay = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.text}>Generating PDF...</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
  },
});