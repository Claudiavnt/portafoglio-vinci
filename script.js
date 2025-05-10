const ISIN = ['IE00BF1B7389', 'IE00B44Z5B48'];
const NUMBER_OF_TITLES = { 'IE00BF1B7389': 25, 'IE00B44Z5B48': 2 };
const ISIN_NAME = { 'IE00BF1B7389': 'MSCI All Country World EUR Hedged', 'IE00B44Z5B48': 'MSCI All Country World' };
const positions = [];

async function fetchPortfolioValue(isin) {
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
        portfolioValue: portfolioValue.toFixed(2),
        positionIcon: 'fa-line-chart'
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
    positionName: 'CASH',
    closingPrice: 0,
    numberOfTitles: 0,
    portfolioValue: liquidita.toFixed(2),
    positionIcon: 'fa-eur'
  });
  fetchPeLPercentage(totalPortfolioValue.toFixed(2));
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
        <i class="fa ${pos.positionIcon}" aria-hidden="true"></i>
      </div>
      <div class="position_name">
        <p>${pos.positionName}</p>
      </div>
      <div class="position_value">
        <p>€ ${pos.portfolioValue}</p>
      </div>
    `;

    // Aggiungiamo la riga al container
    container.appendChild(row);
  });
}

async function fetchPeLPercentage(totalPortfolioValue){
  const investimentoIniziale = 1500;
  const percentage = ((totalPortfolioValue / investimentoIniziale)-1)*100;
  document.getElementById('PeLPercentage').innerText = `${percentage.toFixed(1)} %`;

  const imgEl  = document.getElementById('quote_img');

  if (percentage < 0) {
    imgEl.src = 'svg/percentage_normal.svg';
    imgEl.alt = 'Andamento negativo';
  } else {
    imgEl.src = 'svg/percentage_plus.svg';
    imgEl.alt = 'Andamento positivo';
  }
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