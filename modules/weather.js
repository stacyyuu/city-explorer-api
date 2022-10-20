'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(weatherResponse => parseWeather(weatherResponse.data));
  }
  console.log('cache is ', cache);
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (error) {
    return Promise.reject(error);
  }
}

class Weather {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
  }
}

// function getWeather(request, response) {
// // baseURL, endpoint, query, queryParameters
//   const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}&days=7`;
//   axios
//     .get(url)
//     .then(weatherResponse => {
//       console.log(weatherResponse.data);
//       const weatherArray = weatherResponse.data.data.map(weather => new Forecast(weather));
//       response.status(200).send(weatherArray);
//     })
//     .catch(error => {
//       console.error(error);
//       response.status(500).send(`server error: ${error}`);
//     });
// }


// class Forecast {
//   constructor(weather) {
//     this.date = weather.datetime,
//     this.description = weather.weather.description;
//   }
// }

module.exports = getWeather;
