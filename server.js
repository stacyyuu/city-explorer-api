'use strict';

// requires are similar to imports, importing express, cors, dotenv
const express = require('express');
const cors = require('cors');
// configure dotenv to work for this app 
require('dotenv').config();
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

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

// recieves weather information from weather module
// app.get('/weather', getWeather);
app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send(error.message);
    });
}

// recieves movie information from movie module
app.get('/movies', movieHandler);

function movieHandler(request, response) {
  const { searchQuery } = request.query;
  getMovies(searchQuery)
    .then(movies => response.send(movies))
    .catch((error) => {
      console.error(error);
      response.status(500).send(error.message);
    });
}


// error handling middleware MUST be the last app.use() defined in the server file
// params have to be in order
// app.use((error, request, response, next) => {
//   console.error(error);
//   response.status(500).send(error.message);
// });

// this line of code needs to be LAST line in file
// listen tells our app which port to listen on
// which port to serve our server on 
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
