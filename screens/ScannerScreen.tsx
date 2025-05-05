// screens/ScannerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { validateTicket } from '@/lib/tickets';
import { useEvent } from '@/context/EventContext';
import { useNavigation } from '@react-navigation/native';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { selectedEvent } = useEvent();
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanned && selectedEvent) {
      setScanned(true);

      try {
        const result = await validateTicket(data, selectedEvent.id);

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
    return <View style={styles.center}><Text>Richiesta permessi fotocamera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Nessun accesso alla fotocamera</Text>
        <Button title="Consenti fotocamera" onPress={requestPermission} />
      </View>
    );
  }

  if (!selectedEvent) {
    return (
      <View style={styles.center}>
        <Text style={styles.notice}>Nessun evento selezionato</Text>
        <Button title="Scegli un evento" onPress={() => navigation.navigate('Eventi')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner - {selectedEvent.name}</Text>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {scanned && (
        <Button title="Scansiona di nuovo" onPress={() => setScanned(false)} />
      )}

      <View style={styles.footer}>
        <Button title="Scansiona per un altro evento" onPress={() => navigation.navigate('Eventi')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  camera: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  notice: { fontSize: 16, marginBottom: 12 },
  footer: { marginTop: 20 },
});
