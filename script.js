const ISIN = ['IE00BF1B7389', 'IE00B44Z5B48'];
const NUMBER_OF_TITLES = { 'IE00BF1B7389': 25, 'IE00B44Z5B48': 2 };
const ISIN_NAME = { 'IE00BF1B7389': 'EACW', 'IE00B44Z5B48': 'ACWE' };
const positions = [];

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
      positions.push({
        positionName: ISIN_NAME[isin],
        closingPrice: closingPrice,
        numberOfTitles: NUMBER_OF_TITLES[isin],
        portfolioValue: portfolioValue.toFixed(2)
      })
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
  positions.push({
    positionName: 'Liquidità',
    closingPrice: 0,
    numberOfTitles: 0,
    portfolioValue: liquidita.toFixed(2)
  });
  console.log('Total Portfolio Value:', totalPortfolioValue);

  document.getElementById('portfolioValueDisplay').innerText = `+ ${totalPortfolioValue.toFixed(2)} €`;

  const container = document.getElementById('positionsContainer');
  positions.forEach(pos => {
    // Creiamo un <div class="row position_row">
    const row = document.createElement('div');
    row.className = 'row position_row';

    // Inseriamo il markup interno con template literal
    row.innerHTML = `
      <div class="position_icon">
        <i class="fa fa-money" aria-hidden="true" style="font-size: 2rem; color:#142035"></i>
      </div>
      <div class="position_name">
        <p style="color: #142035; margin-left: 2rem;">${pos.positionName}</p>
      </div>
      <div class="position_value">
        <p style="color: #142035;">€ ${pos.portfolioValue}</p>
      </div>
    `;

    // Aggiungiamo la riga al container
    container.appendChild(row);
  });
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