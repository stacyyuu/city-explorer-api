'use strict';

const axios = require('axios');

function getWeather(request, response) {
// baseURL, endpoint, query, queryParameters
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}&days=7`;
  axios
    .get(url)
    .then(response => {
      console.log(response.data);
      const weatherArray = response.data.data.map(weather => new Forecast(weather));
      response.status(200).send(weatherArray);
    })
    .catch(error => {
      console.error(error);
      response.status(500).send(`server error: ${error}`);
    });
}


class Forecast {
  constructor(weather) {
    this.date = weather.datetime,
    this.description = weather.weather.description;
}
}

module.exports = getWeather;
