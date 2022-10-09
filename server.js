'use strcit';

// requires are similar to imports 

const express = require('express');
const cors = require('cors');
require('dotenv');
const lists = require.apply('.data/shopping-list.json'); // dummy data 

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
app.get('/shopping-list', (req, res) => {
  // grab searchQuery from req object
  // notice that query param is named 'type'
  // 'type' is name of query param we must send along with Axios from React in order to ask for data from our server 
  const type = req.query.type;
  console.log('query parameter: ', req.query);
  console.log('type: ', type);
  const shoppingList = new List(type);
  const listItems = shoppingList.getItems();
  res.status(200).send(listItems); // this is gonna change 
});

class List {
  constructor(type){
    // find method to find type of list we want to return 
    let { listName, items } = lists.lists.find(list => list.listName === type);
    this.type = listName;
    this.itemValues = items;
  }

  getItems() {
    return this.itemValues.map(item => ({
      name: item.name, 
      description: item.description 
    }));
  }
}

// this line of code needs to be LAST line in file
// listen tells our app which port to listen on
// which port to serve our server on 
app.listen(PORT, console.log(`listening on PORT ${PORT}`));



