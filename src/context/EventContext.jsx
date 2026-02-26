import { createContext, useContext, useEffect, useState } from 'react';

const EventContext = createContext();

export function EventProvider({ children }) {
  // Etkinlikleri localStorage'dan çek, yoksa boş dizi başlat
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('pebble_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Etkinlikler değiştikçe localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('pebble_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvents) => {
    setEvents(prev => [...prev, ...newEvents]);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);