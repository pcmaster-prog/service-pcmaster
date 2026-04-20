'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import { LayoutDashboard, Users, UserCog, ClipboardList, Settings, CreditCard } from 'lucide-react';

const menuItems = [
  { name: 'Resumen', path: '/', icon: LayoutDashboard },
  { name: 'Técnicos', path: '/tecnicos', icon: UserCog },
  { name: 'Clientes', path: '/clientes', icon: Users },
  { name: 'Pólizas', path: '/polizas', icon: ClipboardList },
  { name: 'Facturación', path: '/facturacion', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoCircle} />
        <span className={styles.brandName}>PC Master</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon 
                color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
                size={20} 
              />
              <span className={styles.navText}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/config" className={styles.navItem}>
          <Settings color="var(--text-secondary)" size={20} />
          <span className={styles.navText}>Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
