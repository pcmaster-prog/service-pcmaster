'use client';

import React from 'react';
import { UserPlus, Search, Download } from 'lucide-react-native';

const techs = [
  { id: 1, name: 'Roberto Gómez', status: 'online', orders: 12, commission: '$ 3,450.00', lastActive: 'Ahora' },
  { id: 2, name: 'Elena Martínez', status: 'busy', orders: 8, commission: '$ 2,100.00', lastActive: 'En servicio' },
  { id: 3, name: 'Carlos Ruiz', status: 'online', orders: 15, commission: '$ 5,200.00', lastActive: 'Ahora' },
  { id: 4, name: 'Sofía Lara', status: 'offline', orders: 5, commission: '$ 1,200.00', lastActive: 'Hace 2h' },
  { id: 5, name: 'Miguel Ángel', status: 'online', orders: 10, commission: '$ 2,800.00', lastActive: 'Ahora' },
];

export default function TecnicosPage() {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Gestión de Técnicos</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: '#fff' }}>
            <Download size={18} color="var(--text-secondary)" />
            Reporte Semanal
          </button>
          <button className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--accent-primary)', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent-primary)' }}>
            <UserPlus size={18} color="var(--accent-primary)" />
            Nuevo Técnico
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Buscar técnico por nombre o ID..." 
          style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontSize: '1rem' }} 
        />
      </div>

      {/* Tech Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Servicios Semanales</th>
              <th>Comisión Acumulada</th>
              <th>Última Actividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {techs.map((tech) => (
              <tr key={tech.id}>
                <td style={{ fontWeight: 600 }}>{tech.name}</td>
                <td>
                  <span className={`status-badge ${tech.status}`}>
                    {tech.status === 'online' ? 'Disponible' : tech.status === 'busy' ? 'En Servicio' : 'Fuera de Línea'}
                  </span>
                </td>
                <td>{tech.orders}</td>
                <td className="accent-text">{tech.commission}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{tech.lastActive}</td>
                <td>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontSize: '0.9rem', marginRight: '1rem' }}>Detalles</button>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>Pagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
