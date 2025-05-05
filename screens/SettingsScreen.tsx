// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen({ navigation }: any) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impostazioni</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
