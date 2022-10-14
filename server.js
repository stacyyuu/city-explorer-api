'use strict';

// requires are similar to imports, importing express, cors, dotenv
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // configure dotenv to work for this app 
const axios = require('axios');

// const weatherData = require('./data/weather.json'); // dummy data 

// create instance of Express server to run 
const app = express();

// middleware - tells our express app to use cors (bodyguard)
app.use(cors());

// set our PORT variable to tell our Express app where to serve our server 
// PORT is NOT bananas, must be named exactly this, because Heroku looks for variable named PORT 
const PORT = process.env.PORT || 3002;

// define 'home' route aka endpoint
app.get('/', (request, response) => {
  response.send('testing... testing');
});

app.get('/weather', async (request, response, next) => {
  try {
    // baseURL, endpoint, query, queryParameters
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}&days=7`;
    const weatherResponse = await axios.get(url);
    console.log(weatherResponse.data);
    const weatherArray = weatherResponse.data.data.map(weather => new Forecast(weather));
    response.status(200).send(weatherArray);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

class Forecast {
  constructor(weather) {
    this.date = weather.datetime,
    this.description = weather.weather.description;
  }
}

app.get('/movies', async (request, response, next) => {
  try {
    // baseURL, endpoint, query, queryParameters
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.searchQuery}`;
    const movieResponse = await axios.get(url);
    console.log(movieResponse.data);
    const movieArray = movieResponse.data.results.map(title => new Movie(title));
    response.status(200).send(movieArray);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

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

// error handling middleware MUST be the last app.use() defined in the server file
// params have to be in order 
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send(error.message);
});


// this line of code needs to be LAST line in file
// listen tells our app which port to listen on
// which port to serve our server on 
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
