import React from 'react';

const Song = ({song, vote}) => (
  <div className="song-list-entry">
    <span className="song-title">{song.title}</span>
    <span className="song-by">by</span>
    <span className="song-artist">{song.artist}</span>
    <div className="song-votes">
      <span className="green" onClick={() => vote(song, 'up')}><i className="fas fa-chevron-up"></i> {song.upvote}</span>
      <span className="red" onClick={() => vote(song, 'down')}><i className="fas fa-chevron-down"></i> {song.downvote}</span>
    </div>
  </div>
);
export default Song;