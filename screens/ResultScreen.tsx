// screens/ResultScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ResultScreen({ route, navigation }: any) {
  const { ticketId, isValid } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: isValid ? '#A7F3D0' : '#FCA5A5' }]}>
      <Text style={styles.title}>clubster</Text>
      <Text style={styles.status}>{isValid ? 'VALID' : 'INVALID'}</Text>
      <Text style={styles.ticket}>Ticket ID: {ticketId}</Text>
      <Button title="New Scan" onPress={() => navigation.replace('Scanner')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold' },
  status: { fontSize: 24, marginVertical: 10 },
  ticket: { fontSize: 16, marginBottom: 20 },
});
