'use client';

import React from 'react';
import { PlusCircle, Search, FileText, Calendar, ShieldCheck } from 'lucide-react-native';

const currentPolicies = [
  { id: 'P-101', client: 'Hospital General Irapuato', type: 'Premium', equipment: 15, joined: '10/01/2026', renewal: '10/01/2027', status: 'active', monthly: '$ 2,500.00' },
  { id: 'P-102', client: 'Industrial Automotriz Gto', type: 'Enterprise', equipment: 40, joined: '05/02/2026', renewal: '05/02/2027', status: 'active', monthly: '$ 5,800.00' },
  { id: 'P-103', client: 'Plaza Cibeles S.A.', type: 'Pyme', equipment: 5, joined: '20/03/2026', renewal: '20/04/2026', status: 'expiring', monthly: '$ 850.00' },
  { id: 'P-104', client: 'Hotel Parador del Río', type: 'Premium', equipment: 10, joined: '15/12/2025', renewal: '15/12/2026', status: 'active', monthly: '$ 1,800.00' },
];

export default function PolizasPage() {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Pólizas de Servicio</h1>
        
        <button className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--accent-primary)', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent-primary)' }}>
          <PlusCircle size={18} color="var(--accent-primary)" />
          Nueva Póliza
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={22} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID de póliza..." 
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, fontSize: '1rem' }} 
          />
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingreso Mensual Recurrente</p>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>$ 10,950.00</h2>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pólizas Activas</p>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: 'var(--accent-primary)' }}>4</h2>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Alertas de Vencimiento</p>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: '#ffcc00' }}>1</h2>
        </div>
      </div>

      {/* Policies Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Plan</th>
              <th>Equipos</th>
              <th>Próxima Renovación</th>
              <th>Costo Mensual</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPolicies.map((policy) => (
              <tr key={policy.id}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{policy.id}</td>
                <td style={{ fontWeight: 600 }}>{policy.client}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                    {policy.type}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="var(--accent-secondary)" />
                    {policy.equipment}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: policy.status === 'expiring' ? '#ffcc00' : 'inherit' }}>
                    <Calendar size={14} />
                    {policy.renewal}
                  </div>
                </td>
                <td className="accent-text">{policy.monthly}</td>
                <td>
                  <span className={`status-badge ${policy.status === 'expiring' ? 'offline' : 'online'}`} style={{ color: policy.status === 'expiring' ? '#ffcc00' : 'var(--accent-primary)', background: policy.status === 'expiring' ? 'rgba(255, 204, 0, 0.1)' : 'rgba(0, 255, 136, 0.1)' }}>
                    {policy.status === 'active' ? 'Vigente' : 'Por Vencer'}
                  </span>
                </td>
                <td>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={16} />
                    Reporte
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
