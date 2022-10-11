'use strict';

// requires are similar to imports, importing express, cors, dotenv

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherData = require('./data/weather.json'); // dummy data 

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

// define endpoint that gets weather data and returns it to React
app.get('/weather', (request, response, next) => {
  try {
    // grab searchQuery from req object
    // notice that query param is named 'type'
    // 'type' is name of query param we must send along with Axios from React in order to ask for data from our server 
    // const lat = req.query.lat;
    // const lon = req.query.lon;
    // const cityName = req.query.cityName;
    // alternatively, destructuring

    const { lat, lon, searchQuery } = request.query;
    const forecast = new Forecast(searchQuery);
    const forecastArray = forecast.getForecast();

    response.status(200).send(forecastArray); // send full array back to client who requested data from 'weather' endpoint 
  } catch (error) {
    // next can be used to pass an error to Express for the error middleware to handle
    next(error.message);
  }
});

class Forecast {
  constructor(citySelected) {
    // find method to find type of list we want to return 
    let { data } = weatherData.find(city => city.city_name.toLowerCase() === citySelected.toLowerCase());
    this.data = data;
  }

  getForecast() {
    return this.data.map(day => ({
      date: day.datetime,
      description: day.weather.description
    }));
  }
}

// app.get('/fakeError', (request, response, next) => {
//   try {
//     const listThatDoesntExists = require('./listThatDoesntExists.js');
//     response.send(listThatDoesntExists);
//   } catch(error) {
//     next(error.message);
//   }
// });

// error handling middleware MUST be the last app.use() defined in the server file
// params have to be in order 
app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});


// this line of code needs to be LAST line in file
// listen tells our app which port to listen on
// which port to serve our server on 
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));



