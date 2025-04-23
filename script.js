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
    if (data['latestQuote'] && data['latestQuote']['raw']) {
      const closingPrice = parseFloat(data['latestQuote']['raw']);
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
  let portfolioValue = 0;
  const liquidita = 577.16;
  portfolioValues.forEach(value => {
    portfolioValue = portfolioValue + value;
  })
  const totalPortfolioValue = portfolioValue + liquidita
  console.log('Total Portfolio Value:', totalPortfolioValue);

  document.getElementById('portfolioValueDisplay').innerText = `+ ${totalPortfolioValue.toFixed(2)} €`;
}

fetchAllPortfolioValues();

function openInvestimentMemoModal() {
  var modal = document.getElementById("investmentMemoModal");
  modal.style.display = 'block';
  var button = document.getElementById("myBtn");
  button.classList.add("fa-envelope-open");
  button.classList.remove("fa-envelope");
}

function closeInvestmentMemoModal(){
  var modal = document.getElementById("investmentMemoModal");
  modal.style.display = 'none';
  var button = document.getElementById("myBtn");
  button.classList.remove("fa-envelope-open");
  button.classList.add("fa-envelope");
}