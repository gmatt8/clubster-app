// screens/EventSelectionScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { getEventsForManager } from '@/api/events/route';
import { useEvent } from '@/context/EventContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

type Event = {
  id: string;
  name: string;
  start_date: string;
};

type NavigationProp = NativeStackNavigationProp<any>;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { setSelectedEvent } = useEvent();
  const { role, clubId } = useUser();

  // ✅ Reset selected event at screen mount
  useEffect(() => {
    setSelectedEvent(null);
  }, []);

  const loadEvents = async () => {
    try {
      if (role === 'code-user' && clubId) {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('club_id', clubId)
          .or(`end_date.is.null,end_date.gte.${now}`)
          .order('start_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } else if (role === 'manager') {
        const data = await getEventsForManager();
        setEvents(data);
      } else {
        setEvents([]); // fallback
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [role, clubId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select an Event</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            events.length === 0 ? styles.emptyContainer : styles.listContent
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No events available.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedEvent(item);
                navigation.navigate('Scanner');
              }}
            >
              <View style={styles.cardContent}>
                <Ionicons name="calendar-outline" size={24} color="#3b82f6" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.eventName}>{item.name}</Text>
                  <Text style={styles.eventDate}>{formatDate(item.start_date)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 24, fontWeight: '600', color: '#111827' },
  listContent: { padding: 16 },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  eventName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  eventDate: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
});
