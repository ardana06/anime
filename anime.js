const baseUrl = "https://api.jikan.moe/v4";
let currentPage = 1;
let currentGenre = "";
let currentQuery = "";

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

// Жанры
async function fetchGenres() {
  const res = await fetch(`${baseUrl}/genres/anime`);
  const data = await res.json();
  data.data.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre.mal_id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}
fetchGenres();

genreSelect.addEventListener("change", () => {
  currentGenre = genreSelect.value;
  currentPage = 1;
  fetchAnime();
});

// Рандом
randomBtn.addEventListener("click", async () => {
  const res = await fetch(`${baseUrl}/random/anime`);
  const data = await res.json();
  displayAnime([data.data]);
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

// Основная загрузка
async function fetchAnime() {
  let url = `${baseUrl}/anime?page=${currentPage}`;

  if (currentQuery) {
    url = `${baseUrl}/anime?q=${currentQuery}&page=${currentPage}`;
  }

  if (currentGenre) {
    url += `&genres=${currentGenre}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  displayAnime(data.data);
  pageNumber.textContent = currentPage;
}

// Вывод аниме и открытие модального окна
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

    // Событие клика на карточку
    card.addEventListener("click", () => {
      const modal = document.querySelector(".modal-overlay");
      const modalContent = document.querySelector(".modal-content");

      modalContent.innerHTML = `
        <span class="modal-close">&times;</span>
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <p><strong>Episodes:</strong> ${anime.episodes || "?"}</p>
        <p><strong>Type:</strong> ${anime.type}</p>
        <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
        <p><strong>Synopsis:</strong> ${anime.synopsis || "No description available."}</p>
      `;

      modal.style.display = "flex";

      modalContent.querySelector(".modal-close").addEventListener("click", () => {
        modal.style.display = "none";
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    });
  });
}

// Первоначальная загрузка
fetchAnime();
