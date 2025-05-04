// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    // Per ora validiamo se il codice è "1234"
    if (code === '1234') {
      navigation.navigate('EventSelection');
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>clubster</Text>
      <Text style={styles.title}>SCAN</Text>
      <Text style={styles.label}>Enter your access code provided by your manager</Text>
      <TextInput
        placeholder="Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Log in" onPress={handleLogin} />
      {error && <Text style={styles.error}>Invalid access code. Please try again.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold', textAlign: 'center' },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
});
