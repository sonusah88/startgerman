const https = require('https');

https.get('https://www.youtube.com/playlist?list=PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /"videoId":"([a-zA-Z0-9_-]+)"/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(data)) !== null) {
      ids.add(match[1]);
      if(ids.size >= 10) break;
    }
    console.log(Array.from(ids));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
