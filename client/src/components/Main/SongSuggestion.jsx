import React, { Component } from 'react';

const SongSuggestion = (props) => (
  <div className='song-suggestion-container'>
    <img 
      src={props.song.album.images[1].url} 
      className='song-suggestion-album-art'
      onClick={() => {
        props.onClick(props.song);
        window.scrollTo(0, 0);
      }}>
      </img>
    <p className='song-suggestion-song-info'>{props.song.name} x {props.song.artists[0].name}</p>
  </div>
);

export default SongSuggestion;