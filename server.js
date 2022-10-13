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

// define endpoint that gets weather data and returns it to React
// app.get('/weather', (request, response, next) => {
//   try {
//     // grab searchQuery from req object
//     // notice that query param is named 'type'
//     // 'type' is name of query param we must send along with Axios from React in order to ask for data from our server 
//     // const lat = req.query.lat;
//     // const lon = req.query.lon;
//     // const cityName = req.query.cityName;
//     // alternatively, destructuring

//     const { lat, lon, searchQuery } = request.query;
//     const forecast = new Forecast(searchQuery);
//     const forecastArray = forecast.getForecast();

//     response.status(200).send(forecastArray); // send full array back to client who requested data from 'weather' endpoint 
//   } catch (error) {
//     // next can be used to pass an error to Express for the error middleware to handle
//     next(error.message);
//   }
// });


app.get('/weather', async (request, response, next) => {
  try {
    // baseURL, endpoint, query, queryParameters
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}`;
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

//   getForecast() {
//     return this.weather.map(day => ({
//       date: day.datetime,
//       description: day.weather.description
//     }));
//   }
// }

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
