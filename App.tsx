//  App.tsx
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { EventProvider } from './context/EventContext';
<<<<<<< HEAD

// Fix per problemi di rete su simulatore iOS
if (__DEV__) {
  const customGlobal = global as any;

  if (customGlobal.originalXMLHttpRequest) {
    customGlobal.XMLHttpRequest = customGlobal.originalXMLHttpRequest;
  }
  if (customGlobal.originalFormData) {
    customGlobal.FormData = customGlobal.originalFormData;
  }

  console.log('✅ XMLHttpRequest e FormData forzati per ambiente DEV');
}

export default function App() {
  return (
    <EventProvider>
      <AppNavigator />
    </EventProvider>
  );
}
