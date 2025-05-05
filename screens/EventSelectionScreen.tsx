// screens/EventSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getEventsForManager } from '@/api/events/route';
import { supabase } from '@/lib/supabase';
import { useEvent } from '@/context/EventContext'; // assicurati che sia importato!

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedEvent } = useEvent();

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
    <SafeAreaView style={styles.container}>
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
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedEvent(item);
                navigation.navigate('Scanner');
              }}
            >
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{formatDate(item.start_date)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  eventName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  eventDate: { fontSize: 14, color: '#3b82f6' },
  emptyText: {
    marginTop: 50,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});
