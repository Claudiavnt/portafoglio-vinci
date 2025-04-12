const ISIN = ['IE00BF1B7389', 'IE00B44Z5B48'];
const NUMBER_OF_TITLES = {'IE00BF1B7389': 25, 'IE00B44Z5B48': 2}; // Numero di titoli posseduti per ciascun isin

async function fetchPortfolioValue(isin) {
  var BASE_URL="https://www.justetf.com/api/etfs/" + isin + "/quote?locale=it&currency=EUR";

  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    if (data['latestQuote'] && data['latestQuote']['localized'] ) {
      const closingPrice = parseFloat(data['latestQuote']['localized'] );
      const portfolioValue = closingPrice * NUMBER_OF_TITLES[isin];
      console.log(`Ticker ${isin} - Closing Price: ${closingPrice}, Portfolio Value: ${portfolioValue}`);
      return portfolioValue;
    } else {
      console.error(`Errore: Nessun dato trovato per isin ${isin}`, data);
      return;
    }
  } catch (error) {
    console.error(`Errore nella chiamata API per isin ${isin}:`, error);
    return;
  }
}

// Funzione per recuperare i valori di tutti gli isin e sommarli
async function fetchAllPortfolioValues() {
  const promises = ISIN.map(isin => fetchPortfolioValue(isin));
  const portfolioValues = await Promise.all(promises);
  const totalPortfolioValue = portfolioValues.reduce((acc, value) => acc + value, 0);
  console.log('Total Portfolio Value:', totalPortfolioValue);

  // Aggiorna l'elemento HTML con il valore totale
  // Assicurati di avere un elemento nel tuo HTML con id="portfolioValueDisplay"
  document.getElementById('portfolioValueDisplay').innerText = `+ ${totalPortfolioValue.toFixed(2)} €`;
}

fetchAllPortfolioValues();
