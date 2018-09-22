const router = require('express').Router();
const passport = require('passport');

const scope = [
  'user-read-email',
  'streaming',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-read',
  'playlist-read-private',
  'user-library-modify',
  'playlist-modify-public',
  'user-read-recently-played',
  'user-read-private',
  'playlist-modify-private',
  'user-top-read',
  'user-read-birthdate',
];

// Auth logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session.userId = null;
  res.redirect('/login');
});

// Auth with Spotify
router.get('/login', passport.authenticate('spotify', {
  scope,
  showDialog: true
}));

router.get('/spotify/redirect', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => {
  req.session.spotifyId = req.user[0].spotify_id;
  res.redirect('/');
});

router.get('/isLoggedIn', (req, res) => {
  res.send(req.session.userId || null);
});

module.exports = router;