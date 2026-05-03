// ============================================
// AGENTE VISUAL - Historia de México (ULTRA-FIDELIDAD 2000 a.C.)
// Cero modernidad, arquitectura rústica y secuencia narrativa
// ============================================
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generarPromptsImagenes(codigo) {
  const dirs = fs.readdirSync(path.join(__dirname, '..'));
  const esEpisodio = codigo.toUpperCase().startsWith('EP');
  const prefix = esEpisodio ? codigo.toUpperCase() : codigo.padStart(2, '0');
  const carpeta = dirs.find(d => d.toUpperCase().startsWith(prefix));

  if (!carpeta) return;
  const narrativa = fs.readFileSync(path.join(__dirname, '..', carpeta, 'narrativa.md'), 'utf-8');
  console.log(`\n🌑 Aplicando Ultra-Fidelidad Narrativa 2000 a.C.: ${carpeta}...`);

  const prompt = `Eres un Arqueólogo Experimental. Tu misión es diseñar 48 prompts en INGLÉS que sigan paso a paso esta narrativa:
---
${narrativa}
---

REGLAS DE ÉPOCA (PROHIBIDO LO MODERNO):
1. PROTO-PYRAMIDS: NO usar "pirámides perfectas". Usa "Earthen mounds, crude stone platforms, simple mud structures, unpolished rock piles".
2. RAW MATERIALS: Solo pieles de animales recién quitadas, fibras de ixtle crudas, herramientas de palo y piedra rota.
3. SEQUENCE: Mapea los 48 prompts cronológicamente al texto. Cada imagen debe ilustrar una frase o concepto del guion.
4. LOOK: "Vintage 35mm film, desaturated earthy colors, heavy film grain, cinematic shadows, 8k realism".

Formato de salida (SOLO ESTO):
**Image [N]/48:** [Detailed scene following the narrative sequence], crude primitive structures, raw animal skins, rudimentary tools, vintage film aesthetic, 8k, 9:16.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
    });

    const outputPath = path.join(__dirname, '..', carpeta, 'prompts_imagenes.md');
    fs.writeFileSync(outputPath, `# 🌑 Storyboard de Ultra-Fidelidad\n\n${chatCompletion.choices[0].message.content}`);
    console.log(`✅ Storyboard de ultra-fidelidad guardado en: ${carpeta}`);
  } catch (e) { console.error(e.message); }
}

generarPromptsImagenes(process.argv[2] || '01').catch(console.error);
