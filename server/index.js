require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const {createServer} = require('http');

const apiRoutes = require('./routes/api/apiRoutes');
const authRoutes = require('./routes/spotify/authRoutes');
const spotifyApiRoutes = require('./routes/spotify/apiRoutes');

const passportSetup = require('./routes/config/passport-setup');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const db = require('../database/index');
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, //Set for one day
  }
}));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/../client/dist'));


app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/spotify', spotifyApiRoutes);

app.get('/*', (req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('WOOHOO', socket.id);

  // Set up event listeners
  socket.on('addSong', () => {
    io.sockets.emit('songAdded');
  });

  socket.on('songVote', () => {
    io.sockets.emit('songWasVoted');
  });
});