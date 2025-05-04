// navigation/MainStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventSelectionScreen from '@/screens/EventSelectionScreen';
import ScannerScreen from '@/screens/ScannerScreen';
import ResultScreen from '@/screens/ResultScreen';
import { Button } from 'react-native';
import { supabase } from '@/lib/supabase';

const Stack = createNativeStackNavigator();

function LogoutButton() {
  return (
    <Button title="Logout" onPress={() => supabase.auth.signOut()} />
  );
}

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventSelection"
        component={EventSelectionScreen}
        options={{ title: 'Eventi', headerRight: LogoutButton }}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: 'Scanner', headerRight: LogoutButton }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Risultato', headerRight: LogoutButton }}
      />
    </Stack.Navigator>
  );
}
