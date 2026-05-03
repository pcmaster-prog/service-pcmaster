// ============================================
// ORQUESTADOR DE PRODUCCIÓN MASIVA
// Procesa los 52 temas de forma secuencial
// ============================================
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function produccionMasiva() {
  console.log('🚀 INICIANDO PRODUCCIÓN MASIVA AUTÓNOMA (52 TEMAS)\n');

  for (let i = 1; i <= 52; i++) {
    const codigo = i.toString().padStart(2, '0');
    console.log(`\n==================================================`);
    console.log(`🎬 PROCESANDO TEMA ${codigo}/52`);
    console.log(`==================================================`);

    try {
      // Ejecutamos el productor para el tema actual
      // stdio: 'inherit' para ver el progreso en tiempo real
      execSync(`node agente_productor.js ${codigo}`, { stdio: 'inherit' });
      console.log(`✅ TEMA ${codigo} COMPLETADO CON ÉXITO.`);
    } catch (e) {
      console.error(`❌ ERROR EN TEMA ${codigo}: ${e.message}`);
      console.log('⏩ Saltando al siguiente tema...');
    }
  }

  console.log('\n✨ ¡PRODUCCIÓN TOTAL FINALIZADA! ✨');
}

produccionMasiva().catch(console.error);
