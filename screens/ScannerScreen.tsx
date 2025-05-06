// screens/ScannerScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { validateTicket } from '@/lib/tickets';
import { useEvent } from '@/context/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/types/navigation';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getReasonMessage(reason: string): string {
  switch (reason) {
    case 'not_found':
      return 'Ticket not found.';
    case 'wrong_event':
      return 'This ticket is for a different event.';
    case 'already_scanned':
      return 'This ticket has already been scanned.';
    case 'update_failed':
      return 'Error updating ticket. Try again.';
    default:
      return 'Invalid ticket.';
  }
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');

  const [scanResult, setScanResult] = useState<null | { isValid: boolean; ticketId: string; reason?: string }>(null);

  const { selectedEvent } = useEvent();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

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
        setScanResult({ isValid: result.valid, ticketId: data, reason: result.reason });
      } catch (err) {
        console.error('Validation error:', err);
        Alert.alert('Error', 'Failed to validate the ticket.');
        setScanned(false);
      }
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult(null);
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={48} color="#9ca3af" />
        <Text style={styles.message}>Camera access is required to scan tickets.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedEvent) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#f59e0b" />
        <Text style={styles.message}>Select an event to start scanning</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{selectedEvent.name}</Text>
        <Text style={styles.subtitle}>{formatDate(selectedEvent.start_date)}</Text>
      </View>

      <View style={styles.cameraWrapper}>
        {!scanResult && (
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] as const }}
          />
        )}
        <View style={styles.overlayFrame} />

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {scanResult && (
          <View style={[StyleSheet.absoluteFillObject, styles.resultOverlay]}>
            <Ionicons
              name={scanResult.isValid ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={100}
              color={scanResult.isValid ? '#10B981' : '#EF4444'}
              style={styles.icon}
            />
            <Text
              style={[
                styles.statusText,
                { color: scanResult.isValid ? '#065F46' : '#991B1B' },
              ]}
            >
              {scanResult.isValid ? 'VALID TICKET' : 'INVALID TICKET'}
            </Text>
            <Text style={styles.ticketId}>Ticket ID: {scanResult.ticketId}</Text>
            {!scanResult.isValid && scanResult.reason && (
              <Text style={styles.reasonText}>{getReasonMessage(scanResult.reason)}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={resetScanner}>
              <Ionicons name="scan-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.changeEventButton} onPress={() => navigation.navigate('EventSelection')}
      >
        <Ionicons name="refresh-outline" size={20} color="#3b82f6" />
        <Text style={styles.changeEventText}>Change Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  header: { alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '600', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },

  cameraWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlayFrame: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderColor: '#3b82f6',
    borderWidth: 2,
    borderRadius: 16,
    zIndex: 2,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 3,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 12,
  },
  resultOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 10,
  },
  icon: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  changeEventButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e0f2fe',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  changeEventText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
});
