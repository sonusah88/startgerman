const https = require('https');

https.get('https://www.youtube.com/playlist?list=PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const videoMap = new Map();
    // Use regex to find all "videoId":"..." and "title":{"runs":[{"text":"..."}]
    // It's easier to find "playlistVideoRenderer" blocks
    const regex = /"playlistVideoRenderer":\{(.*?)\}/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const block = match[1];
      const idMatch = block.match(/"videoId":"([^"]+)"/);
      const titleMatch = block.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
      if (idMatch && titleMatch) {
        videoMap.set(idMatch[1], titleMatch[1]);
      }
    }
    
    const videos = Array.from(videoMap.entries()).map(([id, title]) => ({ id, title }));
    console.log(JSON.stringify(videos.slice(0, 33), null, 2));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
