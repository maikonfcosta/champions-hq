import fs from 'fs';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const outputFile = path.resolve('./public/all_decks.jsonl');
  const dateFile = path.resolve('./public/last_scraped_date.txt');
  
  // Lê a última data processada ou assume o dia do robô original (02 de Julho de 2026)
  let lastDateStr = '2026-07-02';
  if (fs.existsSync(dateFile)) {
    lastDateStr = fs.readFileSync(dateFile, 'utf8').trim();
  }

  const startDate = new Date(lastDateStr);
  startDate.setDate(startDate.getDate() + 1); // começa do dia seguinte

  const endDate = new Date(); // Hoje
  
  if (startDate > endDate) {
    console.log('Já está atualizado!');
    return;
  }

  let current = new Date(startDate);
  let newDecksCount = 0;
  
  console.log(`Buscando decks novos a partir de ${current.toISOString().split('T')[0]}...`);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    try {
      const res = await fetch(`https://marvelcdb.com/api/public/decklists/by_date/${dateStr}`);
      if (res.ok) {
        const decks = await res.json();
        if (decks.length > 0) {
          const simplified = decks.map(d => ({
            id: d.id,
            name: d.name,
            hero_code: d.hero_code,
            hero_name: d.hero_name,
            aspect: d.meta && d.meta.aspect ? d.meta.aspect : '',
            likes: d.nb_likes || 0,
            username: d.username,
            slots: d.slots || {}
          }));
          
          const lines = simplified.map(s => JSON.stringify(s)).join('\n') + '\n';
          fs.appendFileSync(outputFile, lines);
          newDecksCount += decks.length;
          console.log(`[${dateStr}] +${decks.length} decks.`);
        }
      }
    } catch (e) {
      console.log(`[${dateStr}] Falha: ${e.message}`);
    }
    
    // Atualiza o arquivo com a última data processada com sucesso
    fs.writeFileSync(dateFile, dateStr);

    current.setDate(current.getDate() + 1);
    await sleep(500);
  }
  
  console.log(`Atualização concluída. ${newDecksCount} novos decks adicionados.`);
}

run();
