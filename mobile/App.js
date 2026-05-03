import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDb } from './src/db/database';
import { seedData } from './src/db/seed';
import DashboardScreen from './src/screens/DashboardScreen';
import NewOrderScreen from './src/screens/NewOrderScreen';
import TechniciansScreen from './src/screens/TechniciansScreen';
import PoliciesScreen from './src/screens/PoliciesScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  useEffect(() => {
    const setup = async () => {
      try {
        await initDb();
        await seedData();
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setIsReady(true);
      }
    };
    setup();
  }, []);

  const navigate = (screen) => setCurrentScreen(screen);

  if (!isReady) {
    return (
      <View style={{ flex: Number(1), backgroundColor: '#0a0c10', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#00ff88', fontSize: Number(20), fontWeight: 'bold' }}>PC MASTER</Text>
      </View>
    );
  }

  // Si no hay usuario, mostrar Login
  if (!currentUser) {
    return <LoginScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <View style={{ flex: Number(1), backgroundColor: '#0a0c10' }}>
      {currentScreen === 'Dashboard' && <DashboardScreen navigate={navigate} user={currentUser} logout={() => setCurrentUser(null)} />}
      {currentScreen === 'NewOrder' && <NewOrderScreen navigate={navigate} user={currentUser} />}
      {currentScreen === 'Technicians' && <TechniciansScreen navigate={navigate} user={currentUser} />}
      {currentScreen === 'Policies' && <PoliciesScreen navigate={navigate} user={currentUser} />}
      {currentScreen === 'Reports' && <ReportsScreen navigate={navigate} user={currentUser} />}
    </View>
  );
}
