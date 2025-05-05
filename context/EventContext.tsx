// context/EventContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Event = {
  id: string;
  name: string;
};

type EventContextType = {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event) => void;
};

const EventContext = createContext<EventContextType>({
  selectedEvent: null,
  setSelectedEvent: () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </EventContext.Provider>
  );
};
