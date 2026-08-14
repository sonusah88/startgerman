const https = require('https');
const fs = require('fs');

https.get('https://www.youtube.com/playlist?list=PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('youtube.html', data);
    console.log('Saved to youtube.html');
    
    // Parse regex
    const regex = /"playlistVideoRenderer":\{(.*?)\}/g;
    let match;
    const videoMap = new Map();
    while ((match = regex.exec(data)) !== null) {
      const block = match[1];
      const idMatch = block.match(/"videoId":"([^"]+)"/);
      const titleMatch = block.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
      if (idMatch && titleMatch) {
        // Unescape unicode in title
        const title = JSON.parse(`"${titleMatch[1]}"`);
        videoMap.set(idMatch[1], title);
      }
    }
    
    const videos = Array.from(videoMap.entries()).map(([id, title]) => ({ id, title }));
    fs.writeFileSync('playlist.json', JSON.stringify(videos, null, 2));
    console.log(`Saved ${videos.length} videos to playlist.json`);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
