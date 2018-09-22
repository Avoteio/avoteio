import React from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";


const CurrentSong = (props) => {
  let skipBtn = (props.showSkipBtn) ? <button className='skip-btn' onClick={() => props.skipSong()}>Skip Song</button> : '';
  return (
    <div>
      <div className="current-song">
        <div className="current-image">
          <img src={props.song.image} alt="song's image" />
        </div>
        <div className="current-info">
          <div className="current-title">
            <p>{props.song.title}</p>
          </div>
          <div className="current-artist">
            <p>{props.song.artist}</p>
          </div>
        </div>
      </div>
      <div className='skip-song-container'>
        {skipBtn}
        <div className='skip-song-progress-bar-line'>
          <Progress percent={props.skipVoteCount} theme={{
            success: {
              symbol: props.skipVoteCount + '%',
              trailColor: 'lime',
              color: 'green'
            }
          }} status='success' />
        </div>
        
      </div>
    </div>
    
  )
};

export default CurrentSong;
