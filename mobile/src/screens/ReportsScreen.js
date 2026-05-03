import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ReportsScreen({ navigate }) {
  const [stats, setStats] = useState({ totalRevenue: 0, totalCommission: 0, topServices: [], activeCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://192.168.1.73:3000/api/stats').catch(() => null);
        if (res) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Stats error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Dashboard')}>
          <Text style={{ color: '#fff', fontSize: Number(24) }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agente de Reportes</Text>
        <TouchableOpacity onPress={() => navigate('Dashboard')}>
          <Text style={{ fontSize: Number(24) }}>🏠</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Main Stats Card */}
        <View style={styles.glassCard}>
          <Text style={styles.cardLabel}>Ingresos Totales (Base)</Text>
          <Text style={styles.cardValue}>$ {String(stats.totalRevenue?.toLocaleString() || '0')}</Text>
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.subLabel}>Tus Comisiones</Text>
              <Text style={styles.subValue}>$ {String(stats.totalCommission?.toLocaleString() || '0')}</Text>
            </View>
            <View>
              <Text style={styles.subLabel}>Órdenes Activas</Text>
              <Text style={styles.subValue}>{String(stats.activeCount || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Top Services Section */}
        <Text style={styles.sectionTitle}>Servicios Más Vendidos</Text>
        {stats.topServices?.map((s, idx) => (
          <View key={idx} style={styles.serviceItem}>
            <View style={[styles.bar, { width: String(((s.count / (stats.topServices[0]?.count || 1)) * 100) * 0.6) + '%' }]} />
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{String(s.name)}</Text>
              <Text style={styles.serviceCount}>{String(s.count)} veces</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.refreshBtn} onPress={() => setLoading(true)}>
          <Text style={styles.refreshText}>Actualizar Inteligencia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 20 },
  glassCard: { backgroundColor: 'rgba(0, 255, 136, 0.05)', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.2)', marginBottom: 30 },
  cardLabel: { color: '#a0a0a0', fontSize: 14, marginBottom: 5 },
  cardValue: { color: '#00ff88', fontSize: 36, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  subLabel: { color: '#a0a0a0', fontSize: 12 },
  subValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  serviceItem: { height: 50, marginBottom: 15, justifyContent: 'center' },
  bar: { position: 'absolute', height: '100%', backgroundColor: 'rgba(0, 212, 255, 0.15)', borderRadius: 10 },
  serviceContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
  serviceName: { color: '#fff', fontSize: 14, fontWeight: '500' },
  serviceCount: { color: '#00d4ff', fontWeight: 'bold' },
  refreshBtn: { marginTop: 40, alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 50 },
  refreshText: { color: '#a0a0a0', fontSize: 14 }
});
