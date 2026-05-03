const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const gTTS = require('gtts');

async function producirVideoVintage(codigo) {
  const dirs = fs.readdirSync(__dirname);
  const prefix = codigo.padStart(2, '0');
  const carpeta = dirs.find(d => d.startsWith(prefix));
  if (!carpeta) return;

  const carpetaPath = path.join(__dirname, carpeta);
  const narrativaFile = path.join(carpetaPath, 'narrativa.md');
  const promptsFile = path.join(carpetaPath, 'prompts_imagenes.md');
  const imgFolder = path.join(carpetaPath, 'images');

  if (!fs.existsSync(imgFolder)) fs.mkdirSync(imgFolder);

  console.log(`\n🎬 PRODUCCIÓN VINTAGE: ${carpeta}`);

  // 1. VOZ (Si no existe)
  const audioPath = path.join(carpetaPath, 'voz.mp3');
  if (!fs.existsSync(audioPath)) {
    const texto = fs.readFileSync(narrativaFile, 'utf-8').split('---')[1].trim();
    await new Promise((res) => { new gTTS(texto, 'es').save(audioPath, res); });
    console.log('✅ Voz generada.');
  }

  // 2. GENERAR PROMPTS SI NO EXISTEN O ESTÁN VACÍOS
  // 1. RE-GENERAR PROMPTS CON ESTÉTICA UNIFICADA (Siempre para asegurar el nuevo estilo)
  console.log('🖋️ Actualizando prompts al estilo maestro...');
  execSync(`node agentes/agente_visual.js ${codigo}`, { stdio: 'inherit' });

  // 3. GENERAR IMÁGENES
  const promptsRaw = fs.readFileSync(promptsFile, 'utf-8');
  const lines = promptsRaw.split('\n');
  const prompts = [];
  for (let line of lines) {
    line = line.trim();
    const match = line.match(/Image \d+\/48:?\s*\**\s*(.*)/i);
    if (match) {
      let p = match[1].replace(/\*\*$/, '').replace(/^["']|["']$/g, '').trim();
      if (p) prompts.push(p);
    }
  }

  const tempPromptsFile = path.join(carpetaPath, 'temp_prompts.json');
  fs.writeFileSync(tempPromptsFile, JSON.stringify(prompts));
  
  console.log(`🎨 Verificando imágenes (requeridas 48)...`);
  try {
    execSync(`python generador_local.py "${tempPromptsFile}" "${imgFolder}"`, { stdio: 'inherit' });
  } catch (e) { console.error('Error IA:', e.message); }

  // 4. RENDERIZADO ROBUSTO
  const ffmpegPath = path.join(__dirname, 'ffmpeg.exe');
  const videoOutput = path.join(carpetaPath, 'video_final_vintage.mp4');
  
  let filterComplex = '';
  let inputs = '';
  let count = 0;

  for(let i=1; i<=48; i++) {
    const imgName = `img_${i.toString().padStart(2, '0')}.jpg`;
    const imgPath = path.join(imgFolder, imgName);
    if (fs.existsSync(imgPath)) {
      inputs += `-i "images/${imgName}" `;
      filterComplex += `[${count}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0015,1.5)':d=112:s=1080x1920:fps=30,eq=saturation=0.8:contrast=1.1[v${count+1}];`;
      count++;
    }
  }

  if (count === 0) { console.error('❌ No hay imágenes para renderizar.'); return; }

  const concatInput = Array.from({length:count}, (_,i)=>`[v${i+1}]`).join('');
  const finalFilter = `${filterComplex}${concatInput}concat=n=${count}:v=1:a=0,noise=alls=5:allf=t+u[v]`;
  
  // Escribir filtro a archivo para evitar límite de caracteres en CMD
  const filterFile = path.join(carpetaPath, 'filter.txt');
  fs.writeFileSync(filterFile, finalFilter);

  console.log('🎞️ Renderizando con FFmpeg...');
  const cmd = `"${ffmpegPath}" -y ${inputs} -i voz.mp3 -filter_complex_script "filter.txt" -map "[v]" -map ${count}:a -c:v libx264 -pix_fmt yuv420p -shortest "video_final_vintage.mp4"`;
  
  try {
    execSync(cmd, { cwd: carpetaPath, stdio: 'inherit' });
    console.log(`\n✨ ¡ÉXITO!: ${videoOutput}`);
  } catch (e) { console.error('Error Render:', e.message); }
}

producirVideoVintage(process.argv[2] || '01').catch(console.error);
