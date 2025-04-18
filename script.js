const ISIN = ['IE00BF1B7389', 'IE00B44Z5B48'];
const NUMBER_OF_TITLES = { 'IE00BF1B7389': 25, 'IE00B44Z5B48': 2 };

async function fetchPortfolioValue(isin) {
  // Sostituisci l'URL originale con l'endpoint della funzione serverless
  // Se stai testando in locale con netlify dev, l'URL potrebbe essere:
  // const BASE_URL = "http://localhost:8888/.netlify/functions/etf?isin=" + isin;
  // Altrimenti, dopo il deploy, avrai un URL simile a:
  // https://tuo-progetto.netlify.app/.netlify/functions/etf?isin=IE00BF1B7389
  const BASE_URL = "https://jazzy-melba-944469.netlify.app/.netlify/functions/etf?isin=" + isin;

  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (data['latestQuote'] && data['latestQuote']['localized']) {
      const closingPrice = parseFloat(data['latestQuote']['localized']);
      const portfolioValue = closingPrice * NUMBER_OF_TITLES[isin];
      console.log(`Ticker ${isin} - Closing Price: ${closingPrice}, Portfolio Value: ${portfolioValue}`);
      return portfolioValue;
    } else {
      console.error(`Errore: Nessun dato trovato per isin ${isin}`, data);
      return 0; // oppure gestisci il caso come preferisci
    }
  } catch (error) {
    console.error(`Errore nella chiamata API per isin ${isin}:`, error);
    return 0;
  }
}

// Funzione per recuperare i valori di tutti gli isin e sommarli
async function fetchAllPortfolioValues() {
  const promises = ISIN.map(isin => fetchPortfolioValue(isin));
  const portfolioValues = await Promise.all(promises);
  const totalPortfolioValue = portfolioValues.reduce((acc, value) => acc + value + 577.16, 0);
  console.log('Total Portfolio Value:', totalPortfolioValue);

  document.getElementById('portfolioValueDisplay').innerText = `+ ${totalPortfolioValue.toFixed(2)} €`;
}

fetchAllPortfolioValues();