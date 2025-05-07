// navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '@/screens/LandingScreen';
import LoginScreen from '@/screens/LoginScreen';
import CodeLoginScreen from '@/screens/CodeLoginScreen';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/context/UserContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const { loginWithCode, setRole } = useUser();

  useEffect(() => {
    const init = async () => {
      // Check Supabase auth
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setRole('manager');
        setLoading(false);
        return;
      }

      // Check sessione da AsyncStorage
      const stored = await AsyncStorage.getItem('code_session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session.clubId && session.codeId) {
          loginWithCode(session.clubId, session.codeId);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CodeLogin" component={CodeLoginScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
