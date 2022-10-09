'use strcit';

// requires are similar to imports 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherData = require('./data/weather.json'); // dummy data 

// create instance of Express server
const app = express();

// middleware - tells our express app to use cors
app.use(cors());

// set our PORT variable to tell our Express app where to serve our server 
// PORT is NOT bananas, must be named exactly this, because Heroku looks for variable named PORT 
const PORT = process.env.PORT || 3002;

// define 'home' route aka endpoint
app.get('/', (request, response) => {
  response.send('testing... testing');
});

// define endpoint that gets weather data and returns it to React
app.get('/weather', (req, res, next) => {
  try {
    // grab searchQuery from req object
    // notice that query param is named 'type'
    // 'type' is name of query param we must send along with Axios from React in order to ask for data from our server 
    const lat = req.query.lat;
    const lon = req.query.lon;
    const cityName = req.query.cityName;
    console.log('query parameter: ', req.query);
    console.log('type: ', lat, lon, cityName);
    const currentCity = weatherData.find(data => data.lat === lat && data.lon === lon && data.city_name === cityName);

    const forecast = new Forecast(currentCity);
    const getData = forecast.getItems();

    res.status(200).send(getData); // this is gonna change 
  } catch (error) {
    // next can be used to pass an error to Express for the error middleware to handle
    next(error);
  }
});

class Forecast {
  constructor(date, description) {
    // find method to find type of list we want to return 
    this.date = date;
    this.description = description;
  }

  getItems() {
    return this.currentCity.map(obj => ({
      date: obj.valid_date,
      description: obj.weather.description
    }));
  }
}

app.get('/fakeError', (request, response, next) => {
  try {
    const listThatDoesntExists = require('./listThatDoesntExists.js');
    response.send(listThatDoesntExists);
  } catch(error) {
    next(error.message);
  }
});

// error handling middleware MUST be the last app.use() defined in the server file
app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});


// this line of code needs to be LAST line in file
// listen tells our app which port to listen on
// which port to serve our server on 
app.listen(PORT, console.log(`listening on PORT ${PORT}`));



