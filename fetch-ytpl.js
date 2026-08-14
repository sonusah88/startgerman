const ytpl = require('ytpl');
const fs = require('fs');

async function getPlaylist() {
  try {
    const playlist = await ytpl('PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', { limit: 100 });
    const videos = playlist.items.map(item => ({
      id: item.id,
      title: item.title,
    }));
    fs.writeFileSync('playlist.json', JSON.stringify(videos, null, 2));
    console.log(`Saved ${videos.length} videos`);
  } catch (err) {
    console.error(err);
  }
}

getPlaylist();
