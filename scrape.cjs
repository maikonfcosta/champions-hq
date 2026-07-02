const https = require('https');
https.get('https://hallofheroeslcg.com/browse/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...data.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
    const webpUrls = urls.filter(u => (u.includes('.webp') || u.includes('marvel-1.jpg')) && u.includes('hallofheroeslcg.com/wp-content/uploads/'));
    console.log(webpUrls.join('\n'));
  });
}).on('error', console.error);
