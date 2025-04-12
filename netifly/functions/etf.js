const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  debugger;
  // Legge il parametro 'isin' dalla query string (es. ?isin=IE00BF1B7389)
  const { isin } = event.queryStringParameters || {};
  if (!isin) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parametro isin mancante' }),
    };
  }

  // Costruisce l'URL reale dell'API JustETF
  const URL = `https://www.justetf.com/api/etfs/${isin}/quote?locale=it&currency=EUR`;

  try {
    const response = await fetch(URL, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();

    // Risposta con gli header CORS per permettere chiamate dal browser
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Consente a tutte le origini
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Errore nella fetch:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server' })
    };
  }
};