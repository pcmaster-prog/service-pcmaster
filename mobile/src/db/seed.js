import { db } from './database';

export const seedData = async () => {
  const result = await db.getAllAsync('SELECT count(*) as count FROM clients');
  if (result[0].count > 0) return;

  const clients = [
    { name: 'Hospital General Irapuato', phone: '4621234567', lat: 20.6765, lng: -101.3562, rating: 5, balance: 1200.50 },
    { name: 'Industrial Automotriz Gto', phone: '4629876543', lat: 20.6900, lng: -101.3300, rating: 4, balance: 5400.00 },
    { name: 'Hotel Parador del Río', phone: '4625551122', lat: 20.6700, lng: -101.3600, rating: 5, balance: 0.00 },
    { name: 'Universidad de Guanajuato (DICIS)', phone: '4626667788', lat: 20.6850, lng: -101.3450, rating: 4, balance: 850.00 },
    { name: 'Plaza Cibeles S.A.', phone: '4624443322', lat: 20.7050, lng: -101.3550, rating: 5, balance: 12500.00 }
  ];

  for (const c of clients) {
    await db.runAsync('INSERT INTO clients (name, phone, lat, lng, rating, balance) VALUES (?, ?, ?, ?, ?, ?)', 
      [c.name, c.phone, c.lat, c.lng, c.rating, c.balance]);
  }

  // Seed some initial orders for the dashboard stats
  await db.runAsync(`INSERT INTO orders (client_id, description, status, amount, commission_type, commission_value) 
    VALUES (1, 'Mantenimiento Preventivo Servidores', 'executing', 1500.00, 'percentage', 10)`);
  await db.runAsync(`INSERT INTO orders (client_id, description, status, amount, commission_type, commission_value) 
    VALUES (2, 'Reparación Enfriador Industrial', 'finished', 3500.00, 'fixed', 500)`);
  const serviceResult = await db.getAllAsync('SELECT count(*) as count FROM services');
  if (serviceResult[0].count === 0) {
    const services = [
      { name: 'Formateo de Equipo', price: 700.0, commission: 15.0 },
      { name: 'Mantenimiento Preventivo', price: 700.0, commission: 12.0 },
      { name: 'Instalación de Software', price: 350.0, commission: 10.0 },
      { name: 'Diagnóstico Avanzado', price: 450.0, commission: 20.0 }
    ];

    for (const s of services) {
      await db.runAsync('INSERT INTO services (name, base_price, commission_percentage) VALUES (?, ?, ?)', 
        [s.name, s.price, s.commission]);
    }
  }

  console.log('Seed data injected: Clients and Service Catalog.');
};
