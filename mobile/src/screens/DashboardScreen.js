import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db } from '../db/database';
import { seedData } from '../db/seed';
import { LayoutDashboard, Users, ClipboardList, Wallet, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ open: 0, commission: 0 });

  useEffect(() => {
    const loadStats = async () => {
      // Mock stats for now, eventually real queries
      setStats({ open: 12, commission: 2450 });
    };
    loadStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Buen día, Técnico</Text>
          <Text style={styles.brandText}>Service PC Master</Text>
        </View>
        <MapPin color="#00ff88" size={24} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Motivator Widget */}
        <View style={styles.glassCard}>
          <Text style={styles.cardTitle}>Comisiones de la Semana</Text>
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeBackground}>
              <View style={[styles.gaugeFill, { width: '45%' }]} />
            </View>
            <Text style={styles.gaugeValue}>$ {stats.commission.toLocaleString()}.00</Text>
          </View>
          <Text style={styles.subtext}>Meta: $ 5,000.00</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.smallGlassCard}>
            <LayoutDashboard color="#00ff88" size={20} />
            <Text style={styles.statValue}>{stats.open}</Text>
            <Text style={styles.statLabel}>Abiertos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallGlassCard}>
            <ClipboardList color="#00d4ff" size={20} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>En Ruta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Clientes Recientes (Irapuato)</Text>
        {/* Mock clients list */}
        <View style={styles.clientItem}>
          <Users color="#fff" size={20} style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.clientName}>Hospital General Irapuato</Text>
            <Text style={styles.clientInfo}>Pendiente de Cobro: $1,200.50</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <LayoutDashboard color="#00ff88" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Users color="#a0a0a0" size={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('NewOrder')}
        >
          <Text style={{ color: '#000', fontSize: 24, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <ClipboardList color="#a0a0a0" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Wallet color="#a0a0a0" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  welcomeText: { color: '#a0a0a0', fontSize: 14 },
  brandText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 20 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 15 },
  gaugeContainer: { alignItems: 'center', marginBottom: 10 },
  gaugeBackground: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  gaugeFill: { height: '100%', backgroundColor: '#00ff88' },
  gaugeValue: { color: '#00ff88', fontSize: 28, fontWeight: 'bold' },
  subtext: { color: '#a0a0a0', fontSize: 12, textAlign: 'center' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  smallGlassCard: { width: (width - 60) / 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 15, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  statLabel: { color: '#a0a0a0', fontSize: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  clientItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 15, borderRadius: 12, marginBottom: 10 },
  clientName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  clientInfo: { color: '#a0a0a0', fontSize: 12, marginTop: 2 },
  navBar: { height: 70, backgroundColor: '#161b22', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 10 },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00ff88', justifyContent: 'center', alignItems: 'center', marginTop: -40, elevation: 5, shadowColor: '#00ff88', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
});
