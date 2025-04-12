const API_KEY = '5GMHGQAYK2R9Y05J';
const ISIN = ['IE00BF1B7389', 'IE00B44Z5B48']; // Aggiungi qui altri ticker se necessario
const NUMBER_OF_TITLES = {'IE00BF1B7389': 25, 'IE00B44Z5B48': 2}; // Numero di titoli posseduti per ciascun ticker

// // Funzione per ottenere il valore del portafoglio per un singolo ticker
// async function fetchPortfolioValue(ticker) {
//   const BASE_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;
//   try {
//     const response = await fetch(BASE_URL);
//     const data = await response.json();

//     // Controlla se i dati necessari sono presenti
//     if (data['Meta Data'] && data['Meta Data']['3. Last Refreshed'] && data['Time Series (Daily)']) {
//       const lastRefresh = data['Meta Data']['3. Last Refreshed'];
//       const timeSeries = data['Time Series (Daily)'];
//       const closingPrice = parseFloat(timeSeries[lastRefresh]['4. close']);
//       const portfolioValue = closingPrice * NUMBER_OF_TITLES[ticker]; // Usa il numero di titoli specifico per il ticker
//       console.log(`Ticker ${ticker} - Closing Price: ${closingPrice}, Portfolio Value: ${portfolioValue}`);
//       return portfolioValue;
//     } else {
//       console.error(`Errore: Nessun dato trovato per il ticker ${ticker}`, data);
//       return 0; // Oppure gestisci l'errore come preferisci
//     }
//   } catch (error) {
//     console.error(`Errore nella chiamata API per il ticker ${ticker}:`, error);
//     return 0;
//   }
// }


// // Esegui la funzione al caricamento della pagina
// // fetchAllPortfolioValues();

async function fetchPortfolioValue(isin) {
  var BASE_URL="https://www.justetf.com/api/etfs/" + isin + "/quote?locale=it&currency=EUR";

  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    //     // Controlla se i dati necessari sono presenti
    if (data['latestQuote'] && data['latestQuote']['localized'] ) {
      const closingPrice = parseFloat(data['latestQuote']['localized'] );
      const portfolioValue = closingPrice * NUMBER_OF_TITLES[isin]; // Usa il numero di titoli specifico per il ticker
      console.log(`Ticker ${isin} - Closing Price: ${closingPrice}, Portfolio Value: ${portfolioValue}`);
      return portfolioValue;
    } else {
      console.error(`Errore: Nessun dato trovato per il ticker ${isin}`, data);
      return 0; // Oppure gestisci l'errore come preferisci
    }
  } catch (error) {
    console.error(`Errore nella chiamata API per il ticker ${isin}:`, error);
    return 0;
  }
}

// Funzione per recuperare i valori di tutti i ticker e sommarli
async function fetchAllPortfolioValues() {
  // Mappa ogni ticker alla propria richiesta
  const promises = ISIN.map(isin => fetchPortfolioValue(isin));
  // Attendi il completamento di tutte le richieste
  const portfolioValues = await Promise.all(promises);
  // Somma tutti i valori ottenuti
  const totalPortfolioValue = portfolioValues.reduce((acc, value) => acc + value, 0);
  console.log('Total Portfolio Value:', totalPortfolioValue);

  // Aggiorna l'elemento HTML con il valore totale
  // Assicurati di avere un elemento nel tuo HTML con id="portfolioValueDisplay"
  document.getElementById('portfolioValueDisplay').innerText = `+ ${totalPortfolioValue.toFixed(2)} €`;
}

fetchAllPortfolioValues();
