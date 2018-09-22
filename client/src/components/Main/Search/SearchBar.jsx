import React, { Component } from 'react';
import DropdownSongList from './DropdownSongList.jsx';
import axios from 'axios';
import SongSuggestion from '../SongSuggestion.jsx';
import Slider from 'react-slick';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      spotifyResults: [],
      songSuggestions: [],
      loading: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectSong = this.selectSong.bind(this);
    this.getSongSuggestions = this.getSongSuggestions.bind(this);
  }

  componentDidMount() {
    this.getSongSuggestions();
  }

  getSongSuggestions() {
    axios.get('/spotify/search', {
      params: {
        q: 'drake'
      }
    })
      .then(({ data: { items } }) => {
        this.setState({
          songSuggestions: items,
          loading: false
        });
      }).catch(function (error) {
        console.log(error)
      })
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value
    })
  }

  handleClick(e) {
    //update the main songBank from Database
    e.preventDefault();

    this.setState({
      loading: true
    }, () => {
      // SPOTIFY GET REQUEST
      axios.get('/spotify/search', {
        params: {
          q: this.state.input
        }
      })
        .then(({ data: { items } }) => {
          this.setState({
            loading: false,
            spotifyResults: items,
            songSuggestions: [],
            input: ''
          });
        }).catch(function (error) {
          console.log(error)
        })
    });
  }

  selectSong(songObj) {
    this.props.addSong(songObj);
    this.setState({
      spotifyResults: []
    });
  }

  render() {
    let carouselContents = this.state.spotifyResults.length > 0 ? this.state.spotifyResults : this.state.songSuggestions;

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div className="search">
        <div className="search-bar">
          <input className="search-input" type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button className="search-submit" onClick={(e) => this.handleClick(e)}>Search</button>
        </div>
        {/* <DropdownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong} /> */}
        {this.state.loading ? null :
          <Slider {...sliderSettings}>
            {
              carouselContents.map((suggestion, i) => (
                <SongSuggestion song={suggestion} key={i} onClick={this.selectSong} />
              ))
            }
          </Slider>
        }
      </div>
    );
  }
}




export default SearchBar;