// navigation/MainStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventSelectionScreen from '@/screens/EventSelectionScreen';
import ScannerScreen from '@/screens/ScannerScreen';
import { Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { MainStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

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
    </Stack.Navigator>
  );
}
