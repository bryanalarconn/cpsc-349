import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = "5f89c51d8306421c58cb263b62982312"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w200";


function MovieExplorer() {
  const[currentPage, setCurrentPage] = useState(1);
  const[totalPages, setTotalPages] = useState(1);
  const[currentQuery, setCurrentQuery] = useState("");
  const[movies, setMovies] = useState([]);
  const[sortValue, setSortValue] = useState("");

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

async function getData(page = 1, query = currentQuery) {
  const endpoint = query 
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      console.log(data);
      console.log(data.results);
      
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
      setMovies(data.results || []);

    } catch (error) {
      console.error("Error:", error);
    } 
  }

  const handlePrevClick = () => {
    if (currentPage > 1) {
      getData(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      getData(currentPage + 1);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value.trim();
    setCurrentQuery(query);
    getData(1, query);
  };

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
  };

  useEffect(() => {
    getData(1);
  }, []); 


  const sortedMovies = sortMovies(movies, sortValue);

  return (  
    <div>
      <header>
        <h1 className="title">Movie Explorer</h1>
      </header>
      <div className="search-bar"> 
        <input 
          id="search-input"
          type="text"
          placeholder="Search movies..."
          onChange={handleSearchInput}
        />
        <select id="sort-select" onChange={handleSortChange} value={sortValue}>
              <option value="">Sort By</option>
              <option value="rating-desc">Rating (Desc)</option>
              <option value="rating-asc">Rating (Asc)</option>
              <option value="date-desc">Release Date (Desc)</option>
              <option value="date-asc">Release Date (Asc)</option>
        
        </select>
      </div>

      <div className="movie-list">
        {sortedMovies.length === 0 ? (
          <p>No results found.</p>
        ) : (
        sortedMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title}/>
            <h2>{movie.title}</h2>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
          </div>
        )))}
      </div>

      <div className="page-nav">
        <button id="prev" onClick={handlePrevClick} disabled={currentPage === 1}>
          Previous
        </button>
        <span id="page">Page {currentPage} of {totalPages}</span>
        <button id="next" onClick={handleNextClick} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default MovieExplorer;
