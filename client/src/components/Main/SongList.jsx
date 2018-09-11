import React from 'react';
import Song from './Song.jsx'

const SongList = (props) => (
      <div>
    {/* {console.log('HERE ARE MY SONG LIST PROPS: ', props)} */}
        {props.songBank.map( (song,index)=> <Song title={song.title} artist={song.artist} key={index}   / >)}
      </div>
  
    
)



export default SongList