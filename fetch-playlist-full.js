const https = require('https');

https.get('https://www.youtube.com/playlist?list=PL09NFX-C54c2DRGKvDtaUABPH5yLzj8Z5', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Extract ytInitialData
    const match = data.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (!match) {
      console.error("Could not find ytInitialData");
      return;
    }
    const ytInitialData = JSON.parse(match[1]);
    const items = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
    
    const videos = items.filter(i => i.playlistVideoRenderer).map(i => {
      return {
        id: i.playlistVideoRenderer.videoId,
        title: i.playlistVideoRenderer.title.runs[0].text
      };
    });
    
    console.log(JSON.stringify(videos, null, 2));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
