// ============================================
// AGENTE NARRADOR - Historia de México TikTok
// Motor: GROQ (Llama 3.3 70B) | 52 temas | 10 Episodios
// ============================================
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const EPISODIOS = {
  EP01: { titulo: "Orígenes: El Primer México", era: "c. 2000 – I d.C.", carpeta: "../EP01_origenes",
    temas: ["01. Desarrollo temprano de la agricultura y aldeas en Mesoamérica (c. 2000 a.C.)","02. Auge de la cultura olmeca en La Venta (1200–400 a.C.)","03. Fundación de Cuicuilco (c. 800 a.C.)","04. Fundación de Monte Albán (c. 500 a.C.)","05. Esplendor de Teotihuacán (siglos I–VII d.C.)"]},
  EP02: { titulo: "La Ciudad de los Dioses y el Mundo Maya", era: "250–XII d.C.", carpeta: "../EP02_teotihuacan",
    temas: ["06. La cultura Maya: Palenque y Chichén Itzá (250–900 d.C.)","07. Consolidación de redes comerciales y religiosas mesoamericanas","08. Caída de Teotihuacán (siglo VII–VIII d.C.)","09. Auge de Tula (siglos X–XII d.C.)","10. Caída de Tula (siglo XII)"]},
  EP03: { titulo: "Guerreros y Fundadores: El Imperio Mexica", era: "1325–1520", carpeta: "../EP03_guerreros_fundadores",
    temas: ["11. Fundación de Tenochtitlán (1325)","12. Creación de la Triple Alianza (1428)","13. Expansión del Imperio Mexica (1428–1519)","14. Los Aztecas vs. los Tlaxcaltecas: La alianza con Cortés (1519)","15. La Noche Triste (1520)"]},
  EP04: { titulo: "La Conquista: El Mundo que Se Rompió", era: "1521–1600", carpeta: "../EP04_conquista",
    temas: ["16. Caída de Tenochtitlán (1521)","17. Guerra del Mixtón (1540)","18. Fundación de Guadalajara (1542)","19. Evangelización y transformación religiosa del territorio","20. Consolidación del Virreinato de la Nueva España"]},
  EP05: { titulo: "El Grito de Libertad: La Independencia", era: "1810–1829", carpeta: "../EP05_independencia",
    temas: ["21. Inicio de la Independencia (1810)","22. Ejecución de Miguel Hidalgo (1811)","23. Consumación de la Independencia (1821)","24. Constitución de 1824","25. Presidencia de Guadalupe Victoria (1824–1829)"]},
  EP06: { titulo: "El Siglo de las Batallas I: Guerra y Reforma", era: "1846–1872", carpeta: "../EP06_siglo_xix_parte1",
    temas: ["26. Guerra México–Estados Unidos (1846–1848)","27. Niños Héroes (1847)","28. Guerra de Castas en Yucatán (1847–1901)","29. Reforma Liberal (1855–1861)","30. Gobierno de Benito Juárez (1858–1872)"]},
  EP07: { titulo: "El Siglo de las Batallas II: Imperio y Restauración", era: "1862–1911", carpeta: "../EP07_siglo_xix_parte2",
    temas: ["31. Intervención Francesa (1862–1867)","32. El Segundo Imperio: Maximiliano de Habsburgo (1864–1867)","33. Restauración de la República (1867)","34. Porfiriato con Porfirio Díaz (1876–1911)"]},
  EP08: { titulo: "Revolución: El México que Renació", era: "1910–1940", carpeta: "../EP08_revolucion",
    temas: ["35. Revolución Mexicana (1910–1917)","36. Gobierno de Francisco I. Madero (1911–1913)","37. Constitución de 1917","38. Guerra Cristera (1926–1929)","39. Gobierno de Lázaro Cárdenas (1934–1940)","40. Expropiación petrolera (1938)"]},
  EP09: { titulo: "México Moderno: De Tlatelolco al NAFTA", era: "1968–2006", carpeta: "../EP09_mexico_moderno",
    temas: ["41. Movimiento estudiantil y Matanza de Tlatelolco (1968)","42. Gobierno de Miguel de la Madrid (1982–1988)","43. Terremoto de 1985 (CDMX)","44. Levantamiento Zapatista – EZLN (1994)","45. Tratado de Libre Comercio NAFTA / T-MEC (1994)","46. Asesinato de Luis Donaldo Colosio (1994)","47. Transición democrática con Vicente Fox (2000–2006)"]},
  EP10: { titulo: "México Contemporáneo: De los Sismos al Presente", era: "2017–Hoy", carpeta: "../EP10_mexico_contemporaneo",
    temas: ["48. Terremoto del 19 de septiembre de 2017","49. Gobierno de Andrés Manuel López Obrador (2018–2024)","50. La pandemia de COVID-19 en México (2020)","51. Transformaciones políticas actuales (2024–)","52. México hoy: diversidad cultural, tecnológica y social"]}
};

const TEMAS = {
  "01":{ titulo:"Desarrollo temprano de la agricultura y aldeas en Mesoamérica", era:"c. 2000 a.C.", carpeta:"../01_agricultura_mesoamerica"},
  "02":{ titulo:"Auge de la cultura olmeca en La Venta", era:"1200–400 a.C.", carpeta:"../02_cultura_olmeca"},
  "03":{ titulo:"Fundación de Cuicuilco", era:"c. 800 a.C.", carpeta:"../03_cuicuilco"},
  "04":{ titulo:"Fundación de Monte Albán", era:"c. 500 a.C.", carpeta:"../04_monte_alban"},
  "05":{ titulo:"Esplendor de Teotihuacán", era:"Siglos I–VII d.C.", carpeta:"../05_teotihuacan"},
  "06":{ titulo:"La cultura Maya: Palenque y Chichén Itzá", era:"250–900 d.C.", carpeta:"../06_cultura_maya"},
  "07":{ titulo:"Consolidación de redes comerciales y religiosas mesoamericanas", era:"Siglos III–VII d.C.", carpeta:"../07_redes_comerciales"},
  "08":{ titulo:"Caída de Teotihuacán", era:"Siglo VII–VIII d.C.", carpeta:"../08_caida_teotihuacan"},
  "09":{ titulo:"Auge de Tula", era:"Siglos X–XII d.C.", carpeta:"../09_tula_auge"},
  "10":{ titulo:"Caída de Tula", era:"Siglo XII", carpeta:"../10_tula_caida"},
  "11":{ titulo:"Fundación de Tenochtitlán", era:"1325", carpeta:"../11_tenochtitlan_fundacion"},
  "12":{ titulo:"Creación de la Triple Alianza", era:"1428", carpeta:"../12_triple_alianza"},
  "13":{ titulo:"Expansión del Imperio Mexica", era:"1428–1519", carpeta:"../13_imperio_mexica"},
  "14":{ titulo:"Los Aztecas vs. los Tlaxcaltecas: La alianza con Cortés", era:"1519", carpeta:"../14_tlaxcaltecas_cortes"},
  "15":{ titulo:"La Noche Triste", era:"1520", carpeta:"../15_noche_triste"},
  "16":{ titulo:"Caída de Tenochtitlán", era:"1521", carpeta:"../16_caida_tenochtitlan"},
  "17":{ titulo:"Guerra del Mixtón", era:"1540", carpeta:"../17_guerra_mixton"},
  "18":{ titulo:"Fundación de Guadalajara", era:"1542", carpeta:"../18_guadalajara"},
  "19":{ titulo:"Evangelización y transformación religiosa del territorio", era:"1521–1600", carpeta:"../19_evangelizacion"},
  "20":{ titulo:"Consolidación del Virreinato de la Nueva España", era:"1521–1821", carpeta:"../20_virreinato"},
  "21":{ titulo:"Inicio de la Independencia", era:"1810", carpeta:"../21_independencia_inicio"},
  "22":{ titulo:"Ejecución de Miguel Hidalgo", era:"1811", carpeta:"../22_hidalgo_ejecucion"},
  "23":{ titulo:"Consumación de la Independencia", era:"1821", carpeta:"../23_consumacion_independencia"},
  "24":{ titulo:"Constitución de 1824", era:"1824", carpeta:"../24_constitucion_1824"},
  "25":{ titulo:"Presidencia de Guadalupe Victoria", era:"1824–1829", carpeta:"../25_guadalupe_victoria"},
  "26":{ titulo:"Guerra México–Estados Unidos", era:"1846–1848", carpeta:"../26_guerra_eeuu"},
  "27":{ titulo:"Niños Héroes", era:"1847", carpeta:"../27_ninos_heroes"},
  "28":{ titulo:"Guerra de Castas en Yucatán", era:"1847–1901", carpeta:"../28_guerra_castas"},
  "29":{ titulo:"Reforma Liberal", era:"1855–1861", carpeta:"../29_reforma_liberal"},
  "30":{ titulo:"Gobierno de Benito Juárez", era:"1858–1872", carpeta:"../30_juarez"},
  "31":{ titulo:"Intervención Francesa", era:"1862–1867", carpeta:"../31_intervencion_francesa"},
  "32":{ titulo:"El Segundo Imperio Mexicano: Maximiliano de Habsburgo", era:"1864–1867", carpeta:"../32_maximiliano"},
  "33":{ titulo:"Restauración de la República", era:"1867", carpeta:"../33_restauracion_republica"},
  "34":{ titulo:"Porfiriato con Porfirio Díaz", era:"1876–1911", carpeta:"../34_porfiriato"},
  "35":{ titulo:"Revolución Mexicana", era:"1910–1917", carpeta:"../35_revolucion_mexicana"},
  "36":{ titulo:"Gobierno de Francisco I. Madero", era:"1911–1913", carpeta:"../36_madero"},
  "37":{ titulo:"Constitución de 1917", era:"1917", carpeta:"../37_constitucion_1917"},
  "38":{ titulo:"Guerra Cristera", era:"1926–1929", carpeta:"../38_guerra_cristera"},
  "39":{ titulo:"Gobierno de Lázaro Cárdenas", era:"1934–1940", carpeta:"../39_cardenas"},
  "40":{ titulo:"Expropiación petrolera", era:"1938", carpeta:"../40_expropiacion_petrolera"},
  "41":{ titulo:"Movimiento estudiantil y Matanza de Tlatelolco", era:"1968", carpeta:"../41_tlatelolco"},
  "42":{ titulo:"Gobierno de Miguel de la Madrid", era:"1982–1988", carpeta:"../42_de_la_madrid"},
  "43":{ titulo:"Terremoto de 1985 (CDMX)", era:"1985", carpeta:"../43_terremoto_1985"},
  "44":{ titulo:"Levantamiento Zapatista – EZLN", era:"1994", carpeta:"../44_ezln"},
  "45":{ titulo:"Tratado de Libre Comercio NAFTA / T-MEC", era:"1994", carpeta:"../45_tlc_nafta"},
  "46":{ titulo:"Asesinato de Luis Donaldo Colosio", era:"1994", carpeta:"../46_colosio"},
  "47":{ titulo:"Transición democrática con Vicente Fox", era:"2000–2006", carpeta:"../47_fox_transicion"},
  "48":{ titulo:"Terremoto del 19 de septiembre", era:"2017", carpeta:"../48_terremoto_2017"},
  "49":{ titulo:"Gobierno de Andrés Manuel López Obrador", era:"2018–2024", carpeta:"../49_amlo"},
  "50":{ titulo:"La pandemia de COVID-19 en México", era:"2020", carpeta:"../50_covid"},
  "51":{ titulo:"Transformaciones políticas actuales", era:"2024–", carpeta:"../51_transformaciones_politicas"},
  "52":{ titulo:"México hoy: diversidad cultural, tecnológica y social", era:"Presente", carpeta:"../52_mexico_hoy"}
};

async function generarNarrativa(codigo) {
  const esEpisodio = codigo.toUpperCase().startsWith('EP');
  const item = esEpisodio ? EPISODIOS[codigo.toUpperCase()] : TEMAS[codigo.padStart(2,'0')];
  if (!item) { console.error(`❌ Código "${codigo}" no encontrado.`); return; }

  const descripcion = esEpisodio
    ? `el episodio "${item.titulo}" (${item.era}) cubriendo:\n${item.temas.map(t=>`- ${t}`).join('\n')}`
    : `el tema: "${item.titulo}" (${item.era})`;

  console.log(`\n🎬 Generando narrativa: ${item.titulo}...`);

  const prompt = `Eres un narrador épico y dramático de historia mexicana para TikTok.

Genera una narrativa cautivadora de exactamente 600 palabras sobre ${descripcion}.

REGLAS:
- Empieza con un GANCHO IMPACTANTE (los primeros 2 renglones deben enganchar al espectador)
- Usa un tono épico, dramático y emotivo
- Incluye datos históricos reales y concretos
- Divide la historia en escenas visuales cortas
- Termina EXACTAMENTE con: "Esto es México, y esta historia sigue..."
- Escribe en español de México
- Párrafos de máx 3 líneas`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const narrativa = chatCompletion.choices[0].message.content;

    const carpetaPath = path.join(__dirname, item.carpeta);
    if (!fs.existsSync(carpetaPath)) fs.mkdirSync(carpetaPath, { recursive: true });

    const outputPath = path.join(carpetaPath, 'narrativa.md');
    fs.writeFileSync(outputPath, `# ${item.titulo}\n**Era:** ${item.era}\n\n---\n\n${narrativa}`);
    console.log(`✅ Guardado: ${outputPath}`);
    return narrativa;
  } catch (error) {
    console.error('❌ Error en Groq:', error.message);
  }
}

const arg = process.argv[2] || 'EP01';
generarNarrativa(arg).catch(console.error);
