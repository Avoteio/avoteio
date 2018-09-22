const express = require('express');
const router = express.Router();
const db = require('../../../database/index');
const { incrementSkipVoteCount, zeroSkipVoteCount, getSkipVoteCount, getUserCount, getBSBmode, toggleBSBmode } = require('../../../helpers');

router.get('/isLoggedIn', (req, res) => {
  res.json(req.session.spotifyId || null);
});

router.post('/rooms/:roomId', (req, res) => {
  db.showAllUnplayedSongsInRoom(req.params.roomId, (err, data) => {
    if (err) {
      console.log('NO DATA 4 U', err);
      res.sendStatus(500);
    } else {
      req.session.roomId = req.params.roomId;
      res.json({
        data,
        userId: req.session.spotifyId
      });
    }
  });
});

router.get('/toggleBSBmode', (req, res) => {
  toggleBSBmode();
  res.end();
});

router.post('/createRoom', (req, res) => {
  const { roomName } = req.body;
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
  db.showAllUnplayedSongsInRoom(roomId, (err, data) => {
    if (err) {
      console.log('NO DATA 4 U', err);
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

router.post('/saveSong', (req, res) => {
  let roomId = req.session.roomId;
  let song = req.body.song;
  //ADD SONG TO CURRENT ROOM 
  db.addSongToRoom(song, roomId, function (err, data) {
    if (err) {
      console.log('NOPE insert song', err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/markSongPlayed', (req, res) => {
  const roomId = req.session.roomId;
  const { songObj: { spotify_id } } = req.body;
  db.markSongAsPlayedInRoom({ id: spotify_id }, roomId, (err, result) => {
    if (err) {
      console.log('error updating song played status');
      res.sendStatus(500);
    } else {
      zeroSkipVoteCount();
      res.json(result);
    }
  });
});

router.post('/upvoteSong', (req, res) => {
  const { song } = req.body;
  db.upvoteSongInRoom(song, req.session.roomId, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/upvoteBSBSong', (req, res) => {
  const { song } = req.body;
  db.upvoteBSBSongs(song, req.session.roomId, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/downvoteSong', (req, res) => {
  const { song } = req.body;
  db.downvoteSongInRoom(song, req.session.roomId, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/changeUserVote', (req, res) => {
  const { song, voteDirection } = req.body;
  db.changeUserVote(song, req.session.roomId, voteDirection, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/skipsong', (req, res) => {
  incrementSkipVoteCount();
  res.end();
});

router.get('/skipsong', (req, res) => {
  let skipVoteStats = JSON.stringify(Math.round((getSkipVoteCount() / getUserCount()) * 100));
  res.send(skipVoteStats);
});

module.exports = router;