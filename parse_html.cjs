const fs = require('fs');
const html = fs.readFileSync('hall.html', 'utf8');

const regex = /<a[^>]+href="https:\/\/hallofheroeslcg\.com\/([^/]+)\/"[^>]*>.*?<img[^>]+src="([^"]+)"/gsi;
let match;
const result = {};

while ((match = regex.exec(html)) !== null) {
  let packName = match[1];
  let src = match[2];
  if (src.includes('hallofheroeslcg.com/wp-content/uploads/')) {
    // Strip query params
    src = src.split('?')[0];
    
    // Some packs have multiple links (player vs encounter). We only need one image
    if (!result[packName]) {
      result[packName] = src;
    }
  }
}

console.log(JSON.stringify(result, null, 2));
