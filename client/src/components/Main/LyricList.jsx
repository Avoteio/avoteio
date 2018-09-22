import React, { Component } from 'react';

class LyricList extends Component {
  constructor(props) {
    super(props);
    console.log('current lyricss: ', this.props.currentLyrics);
    this.state = {
      newSong: 0,
      currentLyrics: this.props.currentLyrics
    };
  }

  componentDidUpdate() {
    console.log('update-------------------------------');
    if (this.props.currentLyrics.lyrics !== this.state.currentLyrics.lyrics) {
      console.log('---------------------------------------------------');
      console.log('new lyrics detected');
      this.setState({ currentLyrics: this.props.currentLyrics });
      this.changeSpeed(this.props.currentLyrics.length / 1000);
      this.forceUpdate();
    }
  }
  changeSpeed(songLength) {
    console.log('----------------changing the speed');
    document.getElementsByClassName('marquee2')[0].style.animation = 'none';
    setTimeout(function() {
      document.getElementsByClassName(
        'marquee2'
      )[0].style.animation = `marquee ${songLength}s linear infinite`;
    }, 10);
  }

  render() {
    return (
      <div className="marquee">
        <div className="marquee2">
          {this.state.currentLyrics.lyrics.split('\n').map((line, i) => (
            <div key={'x' + i}>{line}</div>
          ))}
        </div>
      </div>
    );
  }
}
export default LyricList;
