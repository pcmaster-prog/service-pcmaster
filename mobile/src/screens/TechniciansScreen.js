import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TechniciansScreen({ navigate }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await fetch('http://192.168.1.73:3000/api/technicians').catch(() => null);
        if (res) {
          const data = await res.json();
          setTechnicians(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch techs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Dashboard')}>
          <Text style={{ color: '#fff', fontSize: Number(24) }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Equipo Técnico</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando equipo...</Text>
        ) : (
          technicians.map(tech => (
            <View key={tech.id} style={styles.techCard}>
              <View style={styles.avatarContainer}>
                <User color="#00ff88" size={Number(32)} />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.techName}>{String(tech.name)}</Text>
                <Text style={styles.specialty}>{String(tech.specialty)}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Star color="#ffcc00" size={Number(14)} fill="#ffcc00" />
                    <Text style={styles.statText}>{String(tech.rating)}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: tech.status === 'active' ? '#00ff88' : '#ffcc00' }]} />
                    <Text style={styles.statusText}>{tech.status === 'active' ? 'Disponible' : 'En sitio'}</Text>
                  </View>
                </View>
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
  techCard: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0, 255, 136, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  techName: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  specialty: { color: '#00ff88', fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center', gap: 15 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { color: '#fff', fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: '#a0a0a0', fontSize: 11 }
});
