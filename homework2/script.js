const API_KEY = "5f89c51d8306421c58cb263b62982312"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w200";


let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let lastMovies = [];

const list = document.getElementById("movie-list");
const pageIndicator = document.getElementById("page");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next")
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select")

function sortMovies(movies, sortValue) {
    if(!movies || !movies.length) return [];

    switch(sortValue) {
        case "rating-asc":
            return [...movies].sort((a,b)=>(a.vote_average || 0) - (b.vote_average || 0));
        case "rating-desc":
            return [...movies].sort((a,b)=>(b.vote_average || 0) - (a.vote_average || 0));
        case "date-asc":
            return [...movies].sort((a,b)=> 
                new Date(a.release_date || "1900-01-01") - new Date(b.release_date || "1900-01-01"));
        case "date-desc":
            return [...movies].sort((a,b)=> 
                new Date(b.release_date || "1900-01-01") - new Date(a.release_date || "1900-01-01"));

        default:
            return movies;
    }
}

async function getData(page = 1) {
     const endpoint = currentQuery
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(currentQuery)}&page=${page}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        console.log(data);
        console.log(data.results);
        
        totalPages = data.total_pages || 1;
        currentPage = page;
        lastMovies = data.results || [];

        const sorted = sortMovies(lastMovies, sortSelect.value);
        renderMovies(sorted);

        updatePageIndicator();
    } catch (error) {
        console.error("Error:", error);
    }
}
function renderMovies(movies){
    list.innerHTML = "";
    if(!movies || movies.length == 0) {
        list.innerHTML = `<p>No result found.</p>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Release Date: ${movie.release_date}</p>
            <p>Rating: ${movie.vote_average}</p>
            `;
        list.appendChild(card);
    });
}

function updatePageIndicator(){
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage == 1;
    nextBtn.disabled = currentPage == totalPages
}

prevBtn.addEventListener("click", ()=>{
    if(currentPage > 1){
        currentPage--;
        getData(currentPage);
    }
});

nextBtn.addEventListener("click", ()=>{
    if(currentPage < totalPages) {
        currentPage++;
        getData(currentPage);
    }
});

searchInput.addEventListener("input", () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;

  if (currentQuery.length === 0) {
    getData(1);
  } else {
    getData(1);
  }
});

sortSelect.addEventListener("change", () => {
  const sorted = sortMovies(lastMovies, sortSelect.value);
  renderMovies(sorted);
});
    
getData(currentPage);