import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ onLogin }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');

  useEffect(() => {
    fetch('http://192.168.1.73:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleLogin = () => {
    if (!selectedUser || !pin) {
      Alert.alert('Aviso', 'Selecciona un usuario e ingresa tu PIN.');
      return;
    }

    if (selectedUser.pin === pin) {
      onLogin(selectedUser);
    } else {
      Alert.alert('Error', 'PIN incorrecto. Intenta de nuevo.');
      setPin('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PC MASTER</Text>
        <Text style={styles.title}>Identifícate para continuar</Text>
        
        <Text style={styles.label}>Usuario</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
          {users.map(u => (
            <TouchableOpacity 
              key={String(u.id)} 
              style={[styles.userChip, selectedUser?.id === u.id && styles.selectedChip]}
              onPress={() => setSelectedUser(u)}
            >
              <Text style={{ fontSize: 24 }}>{u.role === 'admin' ? '🛡️' : '👨‍🔧'}</Text>
              <Text style={[styles.userName, selectedUser?.id === u.id && { color: '#000' }]}>{u.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedUser && (
          <View style={styles.pinSection}>
            <Text style={styles.label}>Ingresa tu PIN</Text>
            <TextInput 
              style={styles.pinInput}
              placeholder="****"
              placeholderTextColor="#555"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Entrar al Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10', justifyContent: 'center' },
  content: { padding: 30 },
  logo: { color: '#00ff88', fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  title: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 40, opacity: 0.7 },
  label: { color: '#00ff88', fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  userList: { marginBottom: 40 },
  userChip: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20, marginRight: 15, alignItems: 'center', width: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  selectedChip: { backgroundColor: '#00ff88', borderColor: '#00ff88' },
  userName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  pinSection: { marginTop: 20 },
  pinInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 30, textAlign: 'center', padding: 20, borderRadius: 20, marginBottom: 20, letterSpacing: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  loginBtn: { backgroundColor: '#00ff88', padding: 20, borderRadius: 20, alignItems: 'center' },
  loginBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
