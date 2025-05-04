// navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventSelectionScreen from '@/screens/EventSelectionScreen';
import ScannerScreen from '@/screens/ScannerScreen';
import ResultScreen from '@/screens/ResultScreen';
import { Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';

type TabParamList = {
  Eventi: undefined;
  Scanner: undefined;
  Risultato: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function LogoutButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Logout"
      onPress={async () => {
        await supabase.auth.signOut();
        // Reset della navigazione al login (se serve)
        // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }}
    />
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Eventi"
        component={EventSelectionScreen}
        options={{ headerRight: () => <LogoutButton /> }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ headerRight: () => <LogoutButton /> }}
      />
      <Tab.Screen
        name="Risultato"
        component={ResultScreen}
        options={{ headerRight: () => <LogoutButton /> }}
      />
    </Tab.Navigator>
  );
}
