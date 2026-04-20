"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TrendingUp, Users, ClipboardCheck, AlertCircle } from 'lucide-react';

export default function Home() {
  const [liveData, setLiveData] = useState({ totalRevenue: 24500, totalOrders: 84 });

  useEffect(() => {
    const fetchSyncData = async () => {
      try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        
        if (orders.length > 0) {
          const syncRevenue = orders.reduce((sum: number, o: any) => sum + o.amount, 0);
          const syncOrders = orders.length;
          
          setLiveData({
            totalRevenue: 24500 + syncRevenue,
            totalOrders: 84 + syncOrders
          });
        }
      } catch (err) {
        console.error("Sync polling failed", err);
      }
    };

    const interval = setInterval(fetchSyncData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <h1 className="page-title">Resumen de Operación (En Vivo 📡)</h1>
      
      <div className={styles.statsGrid}>
        <article className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TrendingUp size={24} color="var(--accent-primary)" />
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>+LÍNEA</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Ingresos Semanales</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>$ {liveData.totalRevenue.toLocaleString()}</h2>
        </article>

        <article className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ClipboardCheck size={24} color="var(--accent-secondary)" />
            <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>Active</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Órdenes Finalizadas</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>{liveData.totalOrders}</h2>
        </article>

        <article className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Users size={24} color="#fff" />
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Clientes en Irapuato</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>156</h2>
        </article>

        <article className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <AlertCircle size={24} color="#ff4444" />
            <span style={{ color: '#ff4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Urgente</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Pólizas por Vencer</p>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>3</h2>
        </article>
      </div>

      <div className={styles.mainGrid}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Actividad Semanal</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem' }}>
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} style={{ width: '30px', height: `${h}%`, background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', opacity: 0.3 + (h/100) }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Estado de Técnicos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span>Disponibles</span>
                <span className="accent-text">8</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '2px' }}>
                <div style={{ width: '70%', height: '100%', background: 'var(--accent-primary)' }} />
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span>En Servicio</span>
                <span style={{ color: 'var(--accent-secondary)' }}>4</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '2px' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent-secondary)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
