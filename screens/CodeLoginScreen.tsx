// screens/CodeLoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<any>;

export default function CodeLoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithCode } = useUser();

  const handleCodeLogin = async () => {
    if (!code) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('scan_access_codes')
      .select('id, club_id, expires_at')
      .eq('code', code)
      .single();

    setLoading(false);

    if (error || !data) {
      if (error?.code === 'PGRST116' || error?.message?.includes?.('No rows')) {
        Alert.alert('Access Denied', 'Code is invalid or does not exist.');
      } else {
        Alert.alert('Error', error?.message || 'Something went wrong.');
      }
      return;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      Alert.alert('Error', 'Code expired.');
      return;
    }

    loginWithCode(data.club_id, data.id);

    await AsyncStorage.setItem(
      'code_session',
      JSON.stringify({ clubId: data.club_id, codeId: data.id })
    );

    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#6b7280" />
      </TouchableOpacity>

      <Text style={styles.title}>Enter Access Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleCodeLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111827',
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 24,
    color: '#111827',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
