import fs from 'fs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const startDate = new Date('2019-08-10');
  // Ajustando a data final para a data atual
  const endDate = new Date('2026-07-02');
  
  const outputFile = './public/all_decks.jsonl';
  
  // Limpar arquivo anterior se for começar do zero
  // fs.writeFileSync(outputFile, ''); 

  let current = new Date(startDate);
  
  console.log('Iniciando raspagem de decks do MarvelCDB...');

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    try {
      const res = await fetch(`https://marvelcdb.com/api/public/decklists/by_date/${dateStr}`);
      if (!res.ok) {
        console.log(`[${dateStr}] Erro: ${res.status}`);
      } else {
        const decks = await res.json();
        if (decks.length > 0) {
          // Simplificando o deck para economizar espaço
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
          console.log(`[${dateStr}] Baixados ${decks.length} decks.`);
        } else {
          console.log(`[${dateStr}] Nenhum deck.`);
        }
      }
    } catch (e) {
      console.log(`[${dateStr}] Falha na requisição: ${e.message}`);
    }
    
    // Avança 1 dia
    current.setDate(current.getDate() + 1);
    
    // Dorme por 500ms para evitar bloqueio por spam (Rate Limit) no MarvelCDB
    await sleep(500);
  }
  
  console.log('Finalizado! Todos os decks foram baixados.');
}

run();
