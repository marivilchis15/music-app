// script.js
const clientId = '601c5864532a4934b1b544b677634ddc'; // Reemplaza con tu Client ID de Spotify
const redirectUri = 'https://accounts.spotify.com/es/login'; // Reemplaza con tu URI de redirección registrada en Spotify
const clientSecret = '96fb4ea9f8064272807f73d91e5541cb'; // Reemplaza con tu Client Secret de Spotify
const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');

async function searchSpotify() {
  const query = searchInput.value.trim();
  if (query === '') return;

  try {
    const token = await getAccessToken();
    const results = await searchSongs(query, token);
    displayResults(results);
  } catch (error) {
    console.error('Error during Spotify search:', error);
  }
}

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function searchSongs(query, token) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });

  const data = await response.json();
  return data.tracks.items;
}

function displayResults(results) {
  resultsList.innerHTML = '';

  if (results.length === 0) {
    resultsList.innerHTML = '<p>No results found.</p>';
    return;
  }

  results.forEach(song => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${song.name}</strong> by ${song.artists[0].name} <button onclick="playSong('${song.external_urls.spotify}')">Play</button>`; // Corregido aquí
    resultsList.appendChild(listItem);
  });
  profileLink.href = ''; // Reemplaza 'URL_DE_TU_PERFIL' con la URL real de tu perfil
}


function playSong(spotifyUrl, button) {
  console.log('Opening Spotify:', spotifyUrl);
  window.open(spotifyUrl, '_blank');
 
}
function authorizeSpotify() {
  // Construye la URL de autorización de Spotify
  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Redirige al usuario a la página de autorización de Spotify
  window.location.href = authorizeUrl;
}