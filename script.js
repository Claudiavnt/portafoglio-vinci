const ISIN = ['IE00B441G979']; //'IE00B44Z5B48'
const NUMBER_OF_TITLES = { 'IE00B441G979': 16}; // 'IE00B44Z5B48': 2
const ISIN_NAME = { 'IE00B441G979': 'MSCI All Country World EUR Hedged' }; // 'IE00B44Z5B48': 'MSCI All Country World'
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
  const liquidita = 300;
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
  const investimentoIniziale = 1800;
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
  showMemo(0)
}

function closeInvestmentMemoModal(){
  var modal = document.getElementById("investmentMemoModal");
  modal.style.display = 'none';
  var button = document.getElementById("myBtn");
  button.classList.remove("fa-envelope-open");
  button.classList.add("fa-envelope");
}

const memos = [
  {
    title: "17.10.2025",
    subtitle: "Regalo per la cresima",
    text: `
      <p>Inserisci qui il testo del secondo messaggio.</p>
    `
  },
  {
    title: "18.05.2025",
    subtitle: "Regalo per la prima comunione",
    text: `
      <p>Caro Vincenzo,<br>
      in occasione della tua prima comunione, abbiamo deciso di farti un regalo speciale: un investimento.</p>

      <p>Zio Loris, zia Claudia, nonna Titti, nonno Virginio e nonna Lina, insieme, abbiamo raccolto 1.500 euro per te!</p>

      <p>Un giorno, quando sarai maggiorenne, potrai scegliere se raccoglierne i frutti oppure continuare a far crescere questo tesoretto, approfittando dell’effetto compounding. È una forza quasi magica, vedrai!</p>

      <p>Ricorda, però, che ogni investimento porta con sé dei rischi e delle volte si può sbagliare. Non temere, ma anzi impara dagli errori. Investire non è semplice ma richiede pazienza, conoscenza e una buona dose di fortuna.</p>

      <p>L’unico investimento da cui non avrai mai nulla da perdere è il tempo trascorso con le persone che ami e quello speso in ciò che ti rende felice. Ciascuno di questi momenti sarà una ricchezza inestimabile.</p>

      <p>Perciò, abbi cura di te, della tua famiglia e affronta sempre la vita con ottimismo.<br>
      Ti vogliamo bene.</p>
    `
  }
];

function showMemo(index) {
  const memo = memos[index];

  if (!memo) {
    return;
  }

  document.getElementById("memoHistory").style.display = "none";
  document.getElementById("memoDetail").style.display = "block";
  document.getElementById("memoBack").style.display = "block";

  document.getElementById("memoText").innerHTML = `
    <h3>${memo.subtitle}</h3>
    <small>${memo.title}</small>
    ${memo.text}
  `;
}

function showMemoHistory() {
  document.getElementById("memoDetail").style.display = "none";
  document.getElementById("memoHistory").style.display = "block";
  document.getElementById("memoBack").style.display = "none";
}

