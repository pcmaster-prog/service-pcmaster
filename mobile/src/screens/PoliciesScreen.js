import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck, Clock, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PoliciesScreen({ navigate }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking policies for now as we don't have a specific API yet
    const mockPolicies = [
      { id: 1, client: 'Hospital General Irapuato', type: 'Premium', expiry: '2026-12-31', status: 'active' },
      { id: 2, client: 'Industrial Automotriz Gto', type: 'Estándar', expiry: '2026-06-15', status: 'expiring' },
      { id: 3, client: 'Hotel Parador del Río', type: 'Soporte 24/7', expiry: '2027-01-10', status: 'active' }
    ];
    setPolicies(mockPolicies);
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Dashboard')}>
          <Text style={{ color: '#fff', fontSize: Number(24) }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pólizas de Servicio</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando pólizas...</Text>
        ) : (
          policies.map(policy => (
            <View key={policy.id} style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <ShieldCheck color="#00ff88" size={Number(24)} />
                <Text style={styles.clientName}>{String(policy.client)}</Text>
              </View>
              <View style={styles.policyBody}>
                <View style={styles.infoRow}>
                  <Clock color="#a0a0a0" size={Number(16)} />
                  <Text style={styles.infoText}>Tipo: {String(policy.type)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Calendar color="#a0a0a0" size={Number(16)} />
                  <Text style={styles.infoText}>Vence: {String(policy.expiry)}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: policy.status === 'active' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 204, 0, 0.1)' }]}>
                <Text style={[styles.statusText, { color: policy.status === 'active' ? '#00ff88' : '#ffcc00' }]}>
                  {policy.status === 'active' ? 'Vigente' : 'Por Vencer'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 20 },
  loadingText: { color: '#a0a0a0', textAlign: 'center', marginTop: 50 },
  policyCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  policyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  clientName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  policyBody: { gap: 8, marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  infoText: { color: '#a0a0a0', fontSize: 14, marginLeft: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});
