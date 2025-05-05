// screens/ScannerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { validateTicket } from '@/lib/tickets';

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);

      try {
        const result = await validateTicket(data);

        navigation.navigate('Result', {
          ticketId: data,
          isValid: result.valid,
        });
      } catch (err) {
        console.error('Errore validazione:', err);
        Alert.alert('Errore', 'Errore nella validazione del ticket.');
        setScanned(false);
      }
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>clubster</Text>
      <Text style={styles.subtitle}>SCAN</Text>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {scanned && (
        <Button title="Scan again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  camera: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  logout: { textAlign: 'center', color: 'red', marginVertical: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
