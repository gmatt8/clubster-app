// screens/ScannerScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function ScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    if (!scanned) {
      setScanned(true);
      console.log("QR Code Data:", data);

      // Simula una chiamata API di validazione
      const isValid = data.includes("VALID"); // oppure chiama un'API vera

      navigation.navigate('Result', {
        ticketId: data,
        isValid,
      });
    }
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>clubster</Text>
      <Text style={styles.subtitle}>SCAN</Text>

      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'], // scansiona solo QR
        }}
      />

      {scanned && (
        <Button title="Scan again" onPress={() => setScanned(false)} />
      )}

      <Text style={styles.logout} onPress={() => navigation.popToTop()}>
        logout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  camera: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  logout: { textAlign: 'center', color: 'red', marginVertical: 16 },
});
