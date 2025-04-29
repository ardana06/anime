const baseUrl = "https://api.jikan.moe/v4";
let currentPage = 1;
let currentGenre = "";
let currentQuery = "";

// DOM-элементы
const form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const animeList = document.querySelector(".anime-list");
const genreSelect = document.querySelector(".genre-select");
const randomBtn = document.querySelector(".random-button");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumber = document.querySelector(".page-number");

// Поиск
form.addEventListener("submit", function (e) {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  fetchAnime();
});

// Категории (жанры)
fetch(`${baseUrl}/genres/anime`)
  .then(res => res.json())
  .then(data => {
    data.data.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.mal_id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  });

genreSelect.addEventListener("change", () => {
  currentGenre = genreSelect.value;
  currentPage = 1;
  fetchAnime();
});

// Случайное аниме
randomBtn.addEventListener("click", () => {
  fetch(`${baseUrl}/random/anime`)
    .then(res => res.json())
    .then(data => {
      displayAnime([data.data]);
    });
});

// Пагинация
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAnime();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchAnime();
});

// Основная функция
function fetchAnime() {
  let url = `${baseUrl}/anime?page=${currentPage}`;

  if (currentQuery) {
    url = `${baseUrl}/anime?q=${currentQuery}&page=${currentPage}`;
  }

  if (currentGenre) {
    url += `&genres=${currentGenre}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayAnime(data.data);
      pageNumber.textContent = currentPage;
    });
}

// Вывод аниме
function displayAnime(animeArray) {
  animeList.innerHTML = "";

  animeArray.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
      <h3>${anime.title}</h3>
      <p>${anime.type} | ${anime.episodes || "?"} eps</p>
      <p>Score: ${anime.score || "N/A"}</p>
    `;
    animeList.appendChild(card);
  });
}

// Стартовая загрузка
fetchAnime();