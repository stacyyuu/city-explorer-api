'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function getMovies(searchQuery) {
  console.log('search query is: ', searchQuery);
  const key = 'movies-' + searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(movieResponse => parseMovies(movieResponse.data));
  }
  return cache[key].data;
}

function parseMovies(movieData) {
  try {
    const movieArray = movieData.results.map(title => {
      return new Movie(title);
    });
    return Promise.resolve(movieArray);
  } catch (error) {
    return Promise.reject(error);
  }
}

// function getMovies(request, response) {
// // baseURL, endpoint, query, queryParameters
//   const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.searchQuery}`;
//   axios
//     .get(url)
//     .then(movieResponse => {
//       console.log(movieResponse.data);
//       const movieArray = movieResponse.data.results.map(title => new Movie(title));
//       response.status(200).send(movieArray);
//     })
//     .catch(error => {
//       console.error(error);
//       response.status(500).send(`server error: ${error}`);
//     });
// }

class Movie {
  constructor(title) {
    this.name = title.original_title;
    this.overview = title.overview,
    this.average_votes = title.vote_average,
    this.vote_count = title.vote_count,
    this.image_url = `https://image.tmdb.org/t/p/w500${title.poster_path}`,
    this.popularity = title.popularity,
    this.released_on = title.release_date;
  }
}

module.exports = getMovies;
