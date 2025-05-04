// screens/EventSelectionScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>clubster</Text>
      <Text style={styles.sub}>PICK EVENT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold' },
  sub: { fontSize: 18, marginTop: 8 },
});


