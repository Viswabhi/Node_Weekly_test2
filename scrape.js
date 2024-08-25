const puppeteer = require('puppeteer');
const fs = require('fs');

// URL of the IPL stats page
const url = 'https://www.iplt20.com/stats/';

// Scraping function
async function scrapeIPLData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Disable images and CSS to improve load speed
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

    // Example: Scrape Top 10 players with most runs
    const playersData = await page.evaluate(() => {
      let players = [];
      document.querySelectorAll('.js-listingTable tbody tr').forEach(row => {
        let playerName = row.querySelector('.top-players__player-name').innerText.trim();
        let runs = row.querySelector('.top-players__r-value').innerText.trim();
        players.push({
          name: playerName,
          runs: runs
        });
      });
      return players;
    });

    // Save data to a JSON file
    fs.writeFileSync('iplData.json', JSON.stringify(playersData, null, 2), 'utf-8');
    console.log('Data successfully scraped and saved to iplData.json');
  } catch (error) {
    console.error('Failed to load the page or scrape data:', error);
  }

  await browser.close();
}

scrapeIPLData();
