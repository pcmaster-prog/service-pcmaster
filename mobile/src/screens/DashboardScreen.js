import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigate, user, logout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, count: 0, commission: 0 });

  const loadData = async () => {
    try {
      const res = await fetch('http://192.168.1.73:3000/api/orders', { signal: AbortSignal.timeout(5000) }).catch(() => null);
      if (res && res.ok) {
        let data = await res.json();
        if (Array.isArray(data)) {
          if (user.role === 'technician') {
            data = data.filter(o => o.technicianId === user.id || o.assignedTo === user.name);
          }
          setOrders(data);
          const revenue = data.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
          const commission = data.reduce((sum, o) => sum + (Number(o.commission) || 0), 0);
          setStats({ revenue, count: data.length, commission });
        }
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Bienvenido, {user.role === 'admin' ? 'Administrador' : 'Técnico'}</Text>
          <Text style={styles.headerTitle}>{user.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#00ff88', fontSize: 18 }}>Conectando con Servidor...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Tools */}
        <View style={styles.toolsRow}>
          <TouchableOpacity style={styles.toolCard} onPress={() => navigate('NewOrder')}>
            <Text style={{ fontSize: 24 }}>➕</Text>
            <Text style={styles.toolText}>Orden</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolCard} onPress={() => Alert.alert('Próximamente', 'Módulo de Clientes')}>
            <Text style={{ fontSize: 24 }}>👥</Text>
            <Text style={styles.toolText}>Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolCard} onPress={() => navigate('Policies')}>
            <Text style={{ fontSize: 24 }}>🛡️</Text>
            <Text style={styles.toolText}>Póliza</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${String(stats.revenue.toLocaleString())}</Text>
            <Text style={styles.statLabel}>{user.role === 'admin' ? 'Ingresos Totales' : 'Mis Ventas'}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: 'rgba(0, 212, 255, 0.3)' }]}>
            <Text style={[styles.statValue, { color: '#00d4ff' }]}>${String(stats.commission.toLocaleString())}</Text>
            <Text style={styles.statLabel}>Mi Comisión</Text>
          </View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{user.role === 'admin' ? 'Últimas Órdenes' : 'Mis Órdenes'}</Text>
          <TouchableOpacity onPress={loadData}>
            <Text style={styles.viewAll}>Actualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderList}>
          {orders.length === 0 ? (
            <Text style={{ color: '#a0a0a0', textAlign: 'center', marginTop: 20 }}>No hay órdenes registradas.</Text>
          ) : (
            orders.slice(-5).reverse().map((order) => (
              <TouchableOpacity key={String(order.id)} style={styles.orderCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderClient}>{String(order.client?.name || 'Cliente')}</Text>
                  <Text style={styles.orderService}>{String(order.equipment || 'Servicio técnico')}</Text>
                </View>
                <Text style={styles.orderAmount}>${String(order.amount || 0)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigate('NewOrder')}>
        <Text style={{ color: '#000', fontSize: 30, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>

      {/* Premium Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigate('Reports')} style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Reportes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Technicians')} style={styles.navItem}>
          <Text style={styles.navIcon}>👨‍🔧</Text>
          <Text style={styles.navText}>Equipo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Policies')} style={styles.navItem}>
          <Text style={styles.navIcon}>🛡️</Text>
          <Text style={styles.navText}>Pólizas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { padding: 25, paddingTop: 10 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#00ff88', fontSize: 14, fontWeight: '500', marginTop: 5 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 15 },
  toolsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 30 },
  toolCard: { backgroundColor: 'rgba(0, 255, 136, 0.05)', width: (width - 70) / 3, padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.1)' },
  toolText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  statsScroll: { paddingLeft: 25, marginBottom: 30 },
  statCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 22, marginRight: 15, width: 160, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#a0a0a0', fontSize: 12, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 15 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: '#00ff88', fontSize: 13 },
  orderList: { paddingHorizontal: 25 },
  orderCard: { backgroundColor: 'rgba(0, 255, 136, 0.03)', padding: 18, borderRadius: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 255, 136, 0.1)' },
  orderClient: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  orderService: { color: '#a0a0a0', fontSize: 13, marginTop: 4 },
  orderAmount: { color: '#00ff88', fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 100, right: 25, backgroundColor: '#00ff88', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#00ff88', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, zIndex: 10 },
  navBar: { position: 'absolute', bottom: 0, width: '100%', height: 85, backgroundColor: 'rgba(16, 20, 24, 0.98)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 15 },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 22, marginBottom: 4 },
  navText: { color: '#a0a0a0', fontSize: 10, fontWeight: '500' }
});
