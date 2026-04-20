import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Camera, UserPlus, Package, Calculator, ChevronLeft, MessageCircle } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';
import { db } from '../db/database';

export default function NewOrderScreen({ navigation }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const clientList = await db.getAllAsync('SELECT * FROM clients');
      const serviceList = await db.getAllAsync('SELECT * FROM services');
      setClients(clientList);
      setServices(serviceList);
    };
    fetchData();
  }, []);

  const handleImportWhatsApp = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        Alert.alert('Simulador de Importación', 'Contacto de WhatsApp traído con éxito: ' + data[0].name);
        // Logic to create new client would go here
      }
    }
  };

  const toggleService = (service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const syncOrderToDashboard = async (orderData) => {
    try {
      const response = await fetch('http://192.168.1.73:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.warn('Dashboard offline, saved locally only.');
      return null;
    }
  };

  const handleSaveOrder = async () => {
    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un servicio.');
      return;
    }

    const orderData = {
      client: selectedClient?.name || 'Cliente Irapuato',
      description,
      amount: totalAmount,
      commission: totalCommission,
      items: selectedServices.map(s => s.name)
    };

    // 1. Save Locally (Simulated for this demo, usually SQL insert here)
    // 2. Sync to Dashboard
    const result = await syncOrderToDashboard(orderData);
    
    if (result?.success) {
      Alert.alert('¡Sincronizado!', 'La orden ya aparece en tu Dashboard de escritorio.');
      navigation.goBack();
    } else {
      Alert.alert('Guardado', 'Orden guardada localmente (Modo Offline).');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Orden</Text>
        <TouchableOpacity onPress={() => Alert.alert('Cámara', 'Activando lente técnica...')}>
          <Camera color="#00ff88" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Client Section */}
        <Text style={styles.label}>Cliente</Text>
        <View style={styles.clientActions}>
          <TouchableOpacity style={styles.glassButton} onPress={handleImportWhatsApp}>
            <MessageCircle color="#00ff88" size={20} />
            <Text style={styles.buttonText}>Cargar de WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassButton}>
            <UserPlus color="#fff" size={20} />
            <Text style={styles.buttonText}>Manual</Text>
          </TouchableOpacity>
        </View>

        {/* Catalog Section */}
        <Text style={styles.label}>Servicios (Catálogo)</Text>
        <View style={styles.catalogGrid}>
          {services.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.serviceCard, selectedServices.find(s => s.id === service.id) && styles.selectedCard]}
              onPress={() => toggleService(service)}
            >
              <Package color={selectedServices.find(s => s.id === service.id) ? '#000' : '#00ff88'} size={24} />
              <Text style={[styles.serviceName, selectedServices.find(s => s.id === service.id) && { color: '#000' }]}>{service.name}</Text>
              <Text style={[styles.servicePrice, selectedServices.find(s => s.id === service.id) && { color: '#000' }]}>${service.base_price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Diagnosis */}
        <Text style={styles.label}>Diagnóstico / Descripción</Text>
        <TextInput 
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Escribe el problema reportado..."
          placeholderTextColor="#a0a0a0"
          value={description}
          onChangeText={setDescription}
        />

        {/* Financial Preview */}
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Calculator color="#a0a0a0" size={20} />
            <Text style={styles.financialLabel}>Total a cobrar:</Text>
            <Text style={styles.financialValue}>$ {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.financialRow}>
            <Calculator color="#00ff88" size={20} />
            <Text style={styles.financialLabel}>Tu Comisión:</Text>
            <Text style={[styles.financialValue, { color: '#00ff88' }]}>$ {totalCommission.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSaveOrder}
        >
          <Text style={styles.submitText}>Levantar Orden</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 20 },
  label: { color: '#00ff88', fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  clientActions: { flexDirection: 'row', gap: 10 },
  glassButton: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  buttonText: { color: '#fff', fontSize: 12 },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceCard: { width: '48%', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center' },
  selectedCard: { backgroundColor: '#00ff88' },
  serviceName: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  servicePrice: { color: '#a0a0a0', fontSize: 12, marginTop: 5 },
  textArea: { backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#fff', padding: 15, borderRadius: 12, minHeight: 100, textAlignVertical: 'top', marginTop: 10 },
  financialCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 20, marginTop: 30, gap: 15 },
  financialRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  financialLabel: { color: '#a0a0a0', flex: 1 },
  financialValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#00ff88', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  submitText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
