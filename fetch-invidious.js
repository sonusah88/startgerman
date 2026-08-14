const https = require('https');
const fs = require('fs');

https.get('https://vid.puffyan.us/api/v1/playlists/PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const playlist = JSON.parse(data);
      const videos = playlist.videos.map((v, i) => ({
        id: v.videoId,
        title: v.title,
        index: i + 1
      }));
      fs.writeFileSync('playlist.json', JSON.stringify(videos, null, 2));
      console.log(`Saved ${videos.length} videos to playlist.json`);
    } catch(e) {
      console.error(e);
    }
  });
});
