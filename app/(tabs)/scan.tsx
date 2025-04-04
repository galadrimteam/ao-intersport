import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedEnabled, setScannedEnabled] = useState(true);
  const scanningInProgress = useRef(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const resetScanner = () => {
    scanningInProgress.current = false;
    setScannedEnabled(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scannedEnabled || scanningInProgress.current) return;

    try {
      scanningInProgress.current = true;
      Vibration.vibrate(100);
      setScannedEnabled(false);
      Alert.alert("Code bar scanné : ", data);
      setTimeout(() => {
        resetScanner();
      }, 1000);
    } catch (error) {
      console.error(error);
      resetScanner();
    }
  };
  return (
    <ScreenWrapper style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: [
            "aztec",
            "qr",
            "pdf417",
            "code39",
            "code93",
            "code128",
            "datamatrix",
            "ean13",
            "ean8",
          ],
        }}
        onBarcodeScanned={scannedEnabled ? handleBarCodeScanned : undefined}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
