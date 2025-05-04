// screens/EventSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getEventsForManager } from '@/api/events/route';

type Event = {
  id: string;
  name: string;
  start_date: string;
  // Aggiungi qui eventuali altri campi che usi
};

export default function EventSelectionScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventsForManager()
      .then((data) => setEvents(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.start_date}</Text>
        </View>
      )}
    />
  );
}
