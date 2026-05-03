const KEY = 'AIzaSyD7DySs4kEeIVCi4saHASdG2NGQti4-IiA';
const url = `https://generativelanguage.googleapis.com/v1/models?key=${KEY}`;
fetch(url)
  .then(r => r.json())
  .then(d => {
    if (d.models) {
      console.log('\n✅ Modelos disponibles para esta API Key:\n');
      d.models.forEach(m => console.log(' -', m.name));
    } else {
      console.log('Respuesta:', JSON.stringify(d, null, 2));
    }
  })
  .catch(e => console.log('Error:', e.message));
