// ============================================
// ORQUESTADOR MAESTRO - Historia de México
// 52 temas | 10 episodios
// ============================================
const { execSync } = require('child_process');
const path = require('path');

const EPISODIOS = ['EP01','EP02','EP03','EP04','EP05','EP06','EP07','EP08','EP09','EP10'];
const TEMAS = Array.from({length: 52}, (_, i) => (i + 1).toString().padStart(2, '0'));

function procesarCodigo(codigo) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 PROCESANDO: ${codigo}`);
  console.log('='.repeat(50));
  const agentesDir = path.join(__dirname, 'agentes');
  try {
    console.log('\n📖 1/3: Agente Narrador...');
    execSync(`node agente_narrador.js ${codigo}`, { cwd: agentesDir, stdio: 'inherit' });
    console.log('\n🎨 2/3: Agente Visual (48 prompts)...');
    execSync(`node agente_visual.js ${codigo}`, { cwd: agentesDir, stdio: 'inherit' });
    console.log('\n🎵 3/3: Agente Musical...');
    execSync(`node agente_musical.js ${codigo}`, { cwd: agentesDir, stdio: 'inherit' });
    console.log(`\n✅ ${codigo} COMPLETADO`);
  } catch (err) {
    console.error(`❌ Error en ${codigo}:`, err.message);
  }
}

async function main() {
  const arg = process.argv[2];
  
  if (!arg || arg === 'TODOS_EPISODIOS') {
    console.log('🌎 Procesando TODOS los EPISODIOS (EP01–EP10)...');
    for (const ep of EPISODIOS) {
      procesarCodigo(ep);
      await new Promise(r => setTimeout(r, 1000));
    }
  } else if (arg === 'TODOS_TEMAS') {
    console.log('📚 Procesando TODOS los TEMAS INDIVIDUALES (01–52)...');
    for (const tema of TEMAS) {
      procesarCodigo(tema);
      await new Promise(r => setTimeout(r, 1000));
    }
  } else {
    procesarCodigo(arg);
  }
  console.log('\n🎬 ¡PRODUCCIÓN COMPLETA!');
}

main().catch(console.error);
