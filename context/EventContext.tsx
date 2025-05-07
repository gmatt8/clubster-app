// context/EventContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type Event = {
  id: string;
  name: string;
  start_date: string;
};

type EventContextType = {
  selectedEvent: Event | null;
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
};

const EventContext = createContext<EventContextType>({
  selectedEvent: null,
  setSelectedEvent: () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </EventContext.Provider>
  );
};
