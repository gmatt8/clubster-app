// screens/EventSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getEventsForManager } from '@/api/events/route';
import { supabase } from '@/lib/supabase';

type RootStackParamList = {
  Login: undefined;
  EventSelection: undefined;
  Scanner: undefined;
  Result: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventSelection'>;

type Event = {
  id: string;
  name: string;
  start_date: string;
};

export default function EventSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEventsForManager();
        console.log('✅ Eventi ricevuti:', data);
        setEvents(data);
      } catch (err) {
        console.error('❌ Errore durante il caricamento degli eventi:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventi</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>Nessun evento disponibile o errore nel caricamento.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.name}</Text>
              <Text>{item.start_date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  eventItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventTitle: { fontWeight: 'bold' },
  emptyText: {
    marginTop: 50,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});
