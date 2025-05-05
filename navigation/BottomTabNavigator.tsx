// navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventSelectionScreen from '@/screens/EventSelectionScreen';
import ScannerScreen from '@/screens/ScannerScreen';
import ResultScreen from '@/screens/ResultScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Eventi" component={EventSelectionScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Impostazioni" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
