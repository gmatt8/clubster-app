// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.user) {
      setError(loginError?.message || 'Login failed');
      setLoading(false);
      return;
    }

    try {
      const profile = await getUserProfile(data.user.id);

      if (profile.role !== 'manager') {
        await supabase.auth.signOut();
        setError('Unauthorized. This login is for managers only.');
        setLoading(false);
        return;
      }

      navigation.replace('EventSelection');
    } catch (err: any) {
      await supabase.auth.signOut();
      setError(err.message || 'Profile not found.');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>clubster</Text>
      <Text style={styles.title}>Manager Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      <Button title={loading ? 'Logging in...' : 'Log In'} onPress={handleLogin} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 28, color: '#5B21B6', fontWeight: 'bold', textAlign: 'center' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});
