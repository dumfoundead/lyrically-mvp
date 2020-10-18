'use strict';

const apiURL = 'https://api.lyrics.ovh';

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

// Search by song or artist
function searchSongs(term) {
  fetch(`${apiURL}/suggest/${term}`)
    .then(res => res.json())
    .then(data => showData(data))
}

// Show song and artist in DOM
function showData(data) {
  let output = '';

  data.data.forEach(song => {
    output += `
      <li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button id="getLyricsBtn" class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>
    `;
  });

  result.innerHTML = `
    <ul class="songs">
      ${output}
    </ul>
  `;

  if(data.prev || data.next) {
    more.innerHTML = `
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ""}
      ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ""}
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next results
function getMoreSongs(url) {
  fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    .then(res => res.json())
    .then(data => showData(data));
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `
  <h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>
  `;

  more.innerHTML = '';
}

// Event Listeners - 'Search' button click
$('header').on('submit', '#form', function(event) {
  event.preventDefault();
  const searchTerm = search.value.trim();
  if(!searchTerm) {
    alert('Please type in a search term')
  } else {
    searchSongs(searchTerm);
  }
});

// Event listeners - 'Get Lyrics' button click
$('body').on('click', '#getLyricsBtn', function(event) {
  const clickedEl = event.target;
  if(clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');
    getLyrics(artist, songTitle);
  }
});
