import React, { Component } from 'react';
import {data} from '../../dummy_data.js';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx'


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songBank: [],
      roomID: 1
    };
    this.updateSongBank = this.updateSongBank.bind(this);
    this.getAllSongs = this.getAllSongs.bind(this);
  }


  getAllSongs () {
    // e.preventDefault()
    //make a get request to server

      //  axios.get('/getAllSongs',{
      //    roomID:this.state.roomID
      //  }).then(function(response){
        
      //    console.log(response)
      //  }).catch(function(error){
      //    console.log(error)
      //  })
    // this.setState({
    //   songBank
    // })
    console.log('I am getting all Songs!')
  }

  updateSongBank (input) {
    //example push request
    this.state.songBank.push(input)

    // this.setState({
    //   songBank: this.state.songBank
    // })
    
  }

  componentDidMount () {
    //example get request
    let songBank = []
    for (let i = 0; i < 5; i++) {
      let song = {
        title: data.tracks.items[i].name,
        artist: data.tracks.items[i].artists[0].name
      }
      songBank.push(song)
    }
    this.setState({
      songBank:songBank
    })
    
  } 

  

  render() {
    
    // console.log(data.tracks.items);
    return (
      <div>
        <h1>Howdy, World!</h1>
        <SongList songBank= {this.state.songBank} dropdownSongs={this.dropdownSongs}/>
        <SearchBar updateSongBank={this.updateSongBank} roomID={this.state.roomID} getAllSongs={this.getAllSongs}/>
      </div>
    )
  }
}

export default Main;