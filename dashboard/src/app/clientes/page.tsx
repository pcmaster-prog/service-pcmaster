'use client';

import React, { useState } from 'react';
import { Search, UserPlus, MapPin, Filter, MoreHorizontal } from 'lucide-react-native';

const allClients = [
  { id: 1, name: 'Hospital General Irapuato', phone: '4621234567', zone: 'Centro', rating: 5, balance: '$ 1,200.50', status: 'active' },
  { id: 2, name: 'Industrial Automotriz Gto', phone: '4629876543', zone: 'Parque Ind. Castro del Río', rating: 4, balance: '$ 5,400.00', status: 'active' },
  { id: 3, name: 'Hotel Parador del Río', phone: '4625551122', zone: 'Norte', rating: 5, balance: '$ 0.00', status: 'inactive' },
  { id: 4, name: 'Universidad de Guanajuato (DICIS)', phone: '4626667788', zone: 'Salamanca Road', rating: 4, balance: '$ 850.00', status: 'active' },
  { id: 5, name: 'Plaza Cibeles S.A.', phone: '4624443322', zone: 'Villas de Irapuato', rating: 5, balance: '$ 12,500.00', status: 'active' },
  { id: 6, name: 'Taller Mecánico El Veloz', phone: '4621112233', zone: 'Sur', rating: 3, balance: '$ 0.00', status: 'active' },
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = allClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Cardex de Clientes</h1>
        
        <button className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--accent-primary)', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent-primary)' }}>
          <UserPlus size={18} color="var(--accent-primary)" />
          Nuevo Cliente
        </button>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '0.8rem 1.2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={22} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono o zona..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontSize: '1.05rem' }} 
          />
        </div>
        
        <button className="glass-card" style={{ padding: '0.8rem 1.2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <Filter size={22} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Client Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Zona (Irapuato)</th>
              <th>Teléfono</th>
              <th>Calificación</th>
              <th>Saldo Pendiente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: client.status === 'active' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                    <span style={{ fontWeight: 600 }}>{client.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <MapPin size={14} color="var(--text-secondary)" />
                    {client.zone}
                  </div>
                </td>
                <td>{client.phone}</td>
                <td>
                  <span style={{ color: '#ffcc00' }}>{'★'.repeat(client.rating)}{'☆'.repeat(5-client.rating)}</span>
                </td>
                <td className={client.balance !== '$ 0.00' ? 'accent-text' : ''} style={{ fontWeight: client.balance !== '$ 0.00' ? 'bold' : 'normal' }}>
                  {client.balance}
                </td>
                <td>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <MoreHorizontal size={20} color="var(--text-secondary)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredClients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No se encontraron clientes que coincidan con la búsqueda.
        </div>
      )}
    </section>
  );
}
