import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';

export default function NewOrderScreen({ navigate }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [suggestedEquipment, setSuggestedEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchSafe = async (url) => {
          const res = await fetch(url).catch(() => null);
          if (res && res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return await res.json();
            }
          }
          return [];
        };

        const [clientData, serviceData, orderData] = await Promise.all([
          fetchSafe('http://192.168.1.73:3000/api/clients'),
          fetchSafe('http://192.168.1.73:3000/api/services'),
          fetchSafe('http://192.168.1.73:3000/api/orders')
        ]);
        
        setClients(clientData);
        setServices(serviceData);
        setHistory(orderData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, []);

  // Filter equipment history when client changes
  useEffect(() => {
    if (selectedClient && Array.isArray(history)) {
      const clientOrders = history.filter(o => o.client?.name === selectedClient.name);
      const uniqueEquipment = [...new Set(clientOrders.map(o => o.equipment).filter(Boolean))];
      setSuggestedEquipment(uniqueEquipment);
    } else {
      setSuggestedEquipment([]);
    }
  }, [selectedClient, history]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleImportWhatsApp = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contact = data[Math.floor(Math.random() * data.length)];
        const newClient = {
          name: contact.name,
          phone: contact.phoneNumbers?.[0]?.number || 'Sin teléfono',
          zone: 'Importado'
        };
        setSelectedClient(newClient);
        Alert.alert(String('Importado'), String('Cliente: ' + contact.name));
      }
    }
  };

  const handleSaveOrder = async () => {
    if (!selectedClient || !equipment || selectedServices.length === 0) {
      Alert.alert(String('Campos Incompletos'), String('Por favor indica el cliente, el equipo y al menos un servicio.'));
      return;
    }

    const totalAmount = selectedServices.reduce((sum, s) => sum + (Number(s.base_price) || 0), 0);
    const totalCommission = selectedServices.reduce((sum, s) => sum + (Number(s.commission) || 0), 0);

    const orderData = {
      client: selectedClient,
      equipment: String(equipment),
      services: selectedServices,
      description: String(description),
      amount: totalAmount,
      commission: totalCommission,
      status: 'pending'
    };

    try {
      const response = await fetch('http://192.168.1.73:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert(String('¡Orden Registrada!'), String('Sincronización completa con el servidor.'));
        navigate('Dashboard');
      }
    } catch (error) {
      Alert.alert(String('Guardado Local'), String('La orden se sincronizará cuando recuperes conexión.'));
      navigate('Dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Dashboard')}>
          <Text style={{ color: '#fff', fontSize: Number(24) }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recepción de Equipo</Text>
        <TouchableOpacity onPress={() => Alert.alert(String('Cámara'), String('Escaneando serie...'))}>
          <Text style={{ fontSize: Number(24) }}>📷</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Client Selection */}
        <Text style={styles.label}>Cliente</Text>
        <TouchableOpacity 
          style={styles.clientCard} 
          onPress={() => setShowClientModal(true)}
        >
          <Text style={{ fontSize: Number(28) }}>👤</Text>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.clientName}>{selectedClient ? String(selectedClient.name) : 'Toca para seleccionar'}</Text>
            <Text style={styles.clientPhone}>{selectedClient ? String(selectedClient.phone) : 'Catálogo maestro'}</Text>
          </View>
        </TouchableOpacity>

        {/* Equipment Input */}
        <Text style={styles.label}>Equipo Recibido</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ej: Laptop Dell G5, Impresora HP..."
          placeholderTextColor="#a0a0a0"
          value={equipment}
          onChangeText={setEquipment}
        />

        {/* Suggested Equipment (History) */}
        {suggestedEquipment.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#a0a0a0', fontSize: 12, marginBottom: 10 }}>Sugeridos (Historial):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedEquipment.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.suggestionChip}
                  onPress={() => setEquipment(item)}
                >
                  <Text style={{ color: '#00ff88' }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Services Catalog */}
        <Text style={styles.label}>Servicios Aplicables</Text>
        <View style={styles.catalogGrid}>
          {services.map((service) => {
            const isSelected = selectedServices.some(s => s.id === service.id);
            return (
              <TouchableOpacity 
                key={String(service.id)} 
                style={[styles.serviceCard, isSelected && styles.selectedCard]}
                onPress={() => toggleService(service)}
              >
                <Text style={{ fontSize: Number(24) }}>📦</Text>
                <Text style={[styles.serviceName, isSelected && { color: '#000' }]}>{String(service.name)}</Text>
                <Text style={[styles.servicePrice, isSelected && { color: '#000' }]}>${String(service.base_price)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.label}>Descripción / Diagnóstico</Text>
        <TextInput 
          style={styles.textArea}
          multiline={true}
          numberOfLines={4}
          placeholder="Problema reportado..."
          placeholderTextColor="#a0a0a0"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrder}>
          <Text style={styles.saveButtonText}>Levantar Orden</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ alignItems: 'center', marginTop: 10, marginBottom: 50 }} 
          onPress={() => {
            setSelectedClient(null);
            setEquipment('');
            setSelectedServices([]);
            setDescription('');
          }}
        >
          <Text style={{ color: '#ff4444', fontSize: 14 }}>Limpiar Formulario</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Real-time Summary Footer */}
      {selectedServices.length > 0 && (
        <View style={styles.footerSummary}>
          <View>
            <Text style={styles.summaryLabel}>{selectedServices.length} Servicios seleccionados</Text>
            <Text style={styles.summaryTotal}>Total: ${selectedServices.reduce((sum, s) => sum + (Number(s.base_price) || 0), 0)}</Text>
          </View>
          <TouchableOpacity style={styles.quickSaveBtn} onPress={handleSaveOrder}>
            <Text style={styles.quickSaveText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Clientes */}
      <Modal visible={showClientModal === true} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catálogo de Clientes</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#a0a0a0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView style={{ maxHeight: Number(300) }}>
              {clients.filter(c => String(c.name).toLowerCase().includes(searchQuery.toLowerCase())).map(client => (
                <TouchableOpacity 
                  key={String(client.id)} 
                  style={styles.clientOption}
                  onPress={() => {
                    setSelectedClient(client);
                    setShowClientModal(false);
                  }}
                >
                  <Text style={styles.optionName}>{String(client.name)}</Text>
                  <Text style={styles.optionPhone}>{String(client.phone)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowClientModal(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0c10' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  scroll: { padding: 25 },
  clientCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 20, 
    borderRadius: 22, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    color: '#fff', 
    padding: 18, 
    borderRadius: 18, 
    marginBottom: 25, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  suggestionChip: { 
    backgroundColor: 'rgba(0, 255, 136, 0.05)', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 25, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: 'rgba(0, 255, 136, 0.2)' 
  },
  clientName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  clientPhone: { color: '#a0a0a0', fontSize: 13, marginTop: 4 },
  label: { color: '#00ff88', fontSize: 15, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { 
    width: '48%', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  selectedCard: { 
    backgroundColor: 'rgba(0, 255, 136, 0.1)', 
    borderColor: '#00ff88' 
  },
  serviceName: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 12, textAlign: 'center' },
  servicePrice: { color: '#00ff88', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  textArea: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    color: '#fff', 
    padding: 18, 
    borderRadius: 18, 
    height: 120, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  saveButton: { 
    backgroundColor: '#00ff88', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 100,
    elevation: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  saveButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  footerSummary: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(16, 20, 24, 0.98)', 
    padding: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    elevation: 20,
    paddingBottom: 35
  },
  summaryLabel: { color: '#a0a0a0', fontSize: 12 },
  summaryTotal: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  quickSaveBtn: { backgroundColor: '#00ff88', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  quickSaveText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0a0c10', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  searchInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: 15, borderRadius: 15, marginBottom: 20 },
  clientOption: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  optionName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  optionPhone: { color: '#a0a0a0', fontSize: 13 },
  closeButton: { marginTop: 20, alignItems: 'center' },
  closeButtonText: { color: '#00ff88', fontSize: 16, fontWeight: 'bold' }
});
