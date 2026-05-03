// ============================================
// AGENTE MUSICAL - Historia de México TikTok
// Motor: GROQ (Llama 3.3 70B) | Prompts para Producer AI
// ============================================
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generarPromptMusical(codigo) {
  const dirs = fs.readdirSync(path.join(__dirname, '..'));
  const esEpisodio = codigo.toUpperCase().startsWith('EP');
  const prefix = esEpisodio ? codigo.toUpperCase() : codigo.padStart(2, '0');
  const carpeta = dirs.find(d => d.toUpperCase().startsWith(prefix));

  if (!carpeta) { console.error(`❌ Carpeta no encontrada para "${codigo}".`); return; }

  const narrativaFile = path.join(__dirname, '..', carpeta, 'narrativa.md');
  if (!fs.existsSync(narrativaFile)) {
    console.error(`❌ Genera primero la narrativa: node agente_narrador.js ${codigo}`); return;
  }

  const narrativa = fs.readFileSync(narrativaFile, 'utf-8').substring(0, 1500);
  const titulo = narrativa.split('\n')[0].replace('# ', '');
  console.log(`\n🎵 Generando prompt musical: ${titulo}...`);

  const prompt = `Eres un compositor y director musical experto en música épica cinematográfica para TikTok.

Analiza esta narrativa histórica mexicana y crea UN prompt detallado para Producer AI / Suno AI que genere una canción de exactamente 3 minutos:

---
${narrativa}
---

Incluye:
1. **Género principal** (Epic Orchestral, Cinematic Folk, etc.)
2. **Estado emocional** (arco de 3 min: inicio tranquilo → tensión → clímax → resolución)
3. **Instrumentos principales** (incluye prehispánicos si aplica: teponaztli, huehuetl, caracol, quijada)
4. **BPM aproximado**
5. **Estructura de 3 minutos:**
   - 0:00–0:20 Intro | 0:20–1:30 Desarrollo | 1:30–2:30 Clímax | 2:30–2:50 Resolución | 2:50–3:00 Outro
6. **Referencias de estilo** (soundtracks similares)
7. **Prompt final en inglés** listo para copiar en Producer AI

Formato: Markdown con encabezados claros.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const outputPath = path.join(__dirname, '..', carpeta, 'prompt_musica.md');
    fs.writeFileSync(outputPath,
      `# 🎵 Prompt Musical\n**Tema:** ${titulo}\n**Para usar en:** Producer AI / Suno AI / Udio\n**Duración:** 3 minutos exactos\n\n---\n\n${chatCompletion.choices[0].message.content}`
    );
    console.log(`✅ Prompt musical guardado: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error en Groq:', error.message);
  }
}

const arg = process.argv[2] || 'EP01';
generarPromptMusical(arg).catch(console.error);
