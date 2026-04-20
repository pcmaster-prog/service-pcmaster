import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDb } from './src/db/database';
import { seedData } from './src/db/seed';
import DashboardScreen from './src/screens/DashboardScreen';
import NewOrderScreen from './src/screens/NewOrderScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDb();
        await seedData();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setIsReady(true); // Still proceed to show UI errors
      }
    };
    setup();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="NewOrder" component={NewOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
