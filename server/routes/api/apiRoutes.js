const express = require('express');
const router = express.Router();
const db = require('../../../database/index')

router.get('/isLoggedIn', (req, res) => {
  res.json(req.session.spotifyId || null);
});

router.get('/rooms/:roomId', (req, res) => {
  req.session.roomId = req.params.roomId;
  db.showAllUnplayedSongsInRoom(req.session.roomId, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.sendStatus(500);
    } else {
      console.log('data reterieval success!,',data);
      res.json(data);
    }
  });
});

router.post('/createRoom', (req, res) => {
  const {roomName} = req.body;
  db.addRoom(roomName, req.session.spotifyId, (err, room) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.session.roomId = room.insertId;
      res.json(room.insertId);
    }
  });
});

router.get('/getAllSongs', (req, res) => {
  let roomId = req.session.roomId;
  console.log('getAllSongs roomID=',roomId)
  console.log('HER EIS REQ.session',req.session)
  db.showAllUnplayedSongsInRoom(roomId, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.sendStatus(500);
    } else {
      console.log('data reterieval success!,',data);
      res.json(data);
    }
  });
});

router.post('/saveSong', (req,res) => {
  let roomId = req.session.roomId;
  let songObj = req.body.songObj;
  //ADD SONG TO CURRENT ROOM 
  db.addSongToRoom(songObj, roomId, function(err,data){
    if (err) {
      console.log('NOPE insert song',err);
      res.sendStatus(500);
    } else {
      console.log('data insertion success!,',data);
      res.end();
    }
  });
});

module.exports = router;