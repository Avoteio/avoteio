const mysql = require('mysql');

// var connection = mysql.createConnection({
//   host: 'bbj31ma8tye2kagi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user: 'yocqduprp1mltiz3',
//   password: process.env.DB_PASSWORD,
//   database: 'fysv1ohxudop09ay',
//   port: 3306
// });

var connection = mysql.createConnection(process.env.DB_URL);

const getSongInRoom = (songObj, roomId) => {
  connection.query('SELECT * FROM songs s INNER JOIN songs_rooms sr ON s.id = sr.song_id AND sr.room_id = ? AND s.id = (SELECT id FROM songs WHERE spotify_id = ?)', [roomId, songObj.id], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const showAllSongsInRoom = (roomId, callback) => {
  connection.query('SELECT * FROM songs s INNER JOIN songs_rooms sr ON s.id = sr.song_id AND sr.room_id = ?', [roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const addSongToSongsTable = (songObj, callback) => {
  connection.query('INSERT INTO songs (title, artist, image, spotify_id) VALUES (?, ?, ?, ?)', [songObj.name, songObj.artists[0].name, songObj.album.images[1].url, songObj.id], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

const getSongsId = (songObj, callback) => {
  connection.query('SELECT id FROM songs WHERE songs.spotify_id = ?', [songObj.id], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const addSongToRoom = (songObj, roomId, callback) => {
  connection.query('SELECT * FROM songs WHERE songs.spotify_id = ?', [songObj.id], (err, results) => {
    if (err) {
      callback(err);
    } else {
      if (results.length === 0) {
        addSongToSongsTable(songObj, (err, results) => {
          if (err) {
            callback(err);
          } else {
            getSongsId(songObj, (err, results) => {
              if (err) {
                callback(err);
              } else {
                const id = results[0].id;
                connection.query('INSERT INTO songs_rooms (song_id, room_id) VALUES (?, ?)', [id, roomId], (err, results) => {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, results);
                  }
                });
              }
            });
          }
        });
      } else {
        getSongsId(songObj, (err, results) => {
          if (err) {
            callback(err);
          } else {
            const id = results[0].id;
            connection.query('SELECT * FROM songs_rooms WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
              if (err) {
                callback(err);
              } else {
                if (results.length === 0) {
                  connection.query('INSERT INTO songs_rooms (song_id, room_id) VALUES (?, ?)', [id, roomId], (err, results) => {
                    if (err) {
                      callback(err);
                    } else {
                      callback(null, results);
                    }
                  });
                } else {
                  connection.query('UPDATE songs_rooms SET upvote = 0, downvote = 0, isPlayed = 0 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
                    if (err) {
                      callback(err);
                    } else {
                      callback(null, results);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  });
};

const showAllUnplayedSongsInRoom = (roomId, callback) => {
  connection.query('SELECT * FROM songs s INNER JOIN songs_rooms sr ON s.id = sr.song_id AND sr.room_id = ? AND sr.isPlayed = 0 ORDER BY (sr.upvote - sr.downvote) DESC', [roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
}

const addRoom = (roomName, userSpotifyId, callback) => {
  connection.query('INSERT INTO rooms (name, user_id) VALUES (?, (SELECT id FROM users WHERE spotify_id = ?))', [roomName, userSpotifyId], (err, results, fields) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results); //results has a property of 'insertId', which is the room ID just created 
    }
  });
};

const markSongAsPlayedInRoom = (songObj, roomId, callback) => {
  getSongsId(songObj, (err, results) => {
    if (err) {
      callback(err);
    } else {
      const id = results[0].id;
      connection.query('UPDATE songs_rooms SET isPlayed = 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

const markRoomAsInaccessible = (roomId, callback) => {
  connection.query('UPDATE rooms SET isAccessible = 0 WHERE id = ?', [roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const upvoteSongInRoom = (songObj, roomId, callback) => {
  const id = songObj.song_id;
  connection.query('UPDATE songs_rooms SET upvote = upvote + 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const downvoteSongInRoom = (songObj, roomId, callback) => {
  const id = songObj.song_id;
  connection.query('UPDATE songs_rooms SET downvote = downvote + 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const addUser = (userObj, callback) => {
  connection.query('SELECT * FROM users WHERE spotify_id = ?', [userObj.spotify_id], (err, existingUser) => {
    if (err) {
      callback(err);
    } else {
      if (existingUser.length === 0) {
        connection.query('INSERT INTO users (spotify_id, spotify_display_name, access_token, refresh_token, token_expires_at) VALUES (?, ?, ?, ? ,?)', [userObj.spotify_id, userObj.spotify_display_name, userObj.access_token, userObj.refresh_token, userObj.token_expires_at], (err, results) => {
          if (err) {
            callback(err);
          } else {
            callback(null, results);
          }
        })
      } else {
        callback(null, existingUser);
      }
    }
  });
};

const getUserById = (userId, callback) => {
  connection.query('SELECT * FROM users WHERE users.id = ?', [userId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const getUserBySpotifyId = (spotify_id, callback) => {
  connection.query('SELECT * FROM users WHERE users.spotify_id = ?', [spotify_id], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const getUserByRoomId = (roomId, callback) => {
  connection.query('SELECT * FROM users WHERE users.id = (SELECT user_id FROM rooms WHERE rooms.id = ?)', [roomId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

const updateUserAccessTokenAndExpiresAt = (userSpotifyId, accessToken, tokenExpirationDate, callback) => {
  connection.query('UPDATE users SET access_token = ?, token_expires_at = ? WHERE spotify_id = ?', [accessToken, tokenExpirationDate, userSpotifyId], (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  })
};

module.exports = {
  showAllSongsInRoom,
  getSongsId,
  addSongToRoom,
  addRoom,
  markSongAsPlayedInRoom,
  markRoomAsInaccessible,
  upvoteSongInRoom,
  downvoteSongInRoom,
  addUser,
  getUserById,
  getUserBySpotifyId,
  getUserByRoomId,
  updateUserAccessTokenAndExpiresAt,
  getSongInRoom,
  showAllUnplayedSongsInRoom
};