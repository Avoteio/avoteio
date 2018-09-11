require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const db = require('../database/index.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});


app.get('/', (req, res) => {
  db.query('SELECT * ')
})
