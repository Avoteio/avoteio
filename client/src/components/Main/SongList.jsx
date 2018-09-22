import React from 'react';
import Song from './Song.jsx';

const SongList = (props) => (
  <div className="song-list">
    {props.songBank.map(song => (
      <Song song={song} key={song.id} vote={props.vote} />
    ))}
  </div>
);

export default SongList;