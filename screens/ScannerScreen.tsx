// screens/ScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    // logica semplice: se QR contiene "VALID", lo consideriamo valido
    const isValid = data.includes('VALID');
    navigation.navigate('Result', { ticketId: data, isValid });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>clubster</Text>
      <Text style={styles.subtitle}>SCAN</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scanned && <Button title="Start Scan" onPress={() => setScanned(false)} />}
      <Text style={styles.logout} onPress={() => navigation.popToTop()}>logout</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  scanner: { flex: 1 },
  logout: { textAlign: 'center', color: 'red', marginVertical: 16 },
});
