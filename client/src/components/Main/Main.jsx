import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CurrentSong from './CurrentSong.jsx';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import LyricList from './LyricList.jsx';
import Modes from './Modes.jsx';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songBank: [],
      currentSong: null,
      currentLyrics: {
        lyrics: 'I am lyridd\n \n \n \n \n \n \n \n c',
        length: 0
      },
      roomID: null,
      roomHostId: null,
      roomName: '',
      userId: null,
      playNextSong: false,
      skipVoteCount: 0,
      showSkipBtn: true,
      showBSBBtn: false
    };

    this.checkSongStatus = null;
    this.setPlayNextSong = null;
    this.getAllSongs = this.getAllSongs.bind(this);
    this.getSongStatus = this.getSongStatus.bind(this);
    this.playNextSong = this.playNextSong.bind(this);
    this.addSong = this.addSong.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.vote = this.vote.bind(this);
    this.skipSong = this.skipSong.bind(this);
    this.getSkipVoteCount = this.getSkipVoteCount.bind(this);
    this.clickBSBmode = this.clickBSBmode.bind(this);

    // Listen for socket events and respond accordingly
    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('connection made client side');
    });

    this.socket.on('songAdded', () => {
      this.getAllSongs();
    });

    this.socket.on('songWasVoted', () => {
      this.getAllSongs();
    });

    this.socket.on('updateSkipSongStats', () => {
      this.getSkipVoteCount();
    });

    this.socket.on('renderSkipBtn', () => {
      this.setState({ showSkipBtn: true });
    });
  }

  componentDidMount() {
    localStorage.clear();
    // Go get the current userId (null if not signed in) and roomId from the server
    const { roomId } = this.props.match.params;
    axios
      .post(`/api/rooms/${roomId}`)
      .then(({ data }) => {
        this.setState({
          roomID: roomId,
          userId: data.userId
        });
      })
      .then(() => {
        this.getHostId();
      })
      .catch(err => {
        console.log(err);
      });

    this.getAllSongs(); // Get all unplayed songs for this room
    this.getSongStatus(); // Begin polling spotify for the time remaining on the host's currently playing song
    this.pollCurrentSong(); // Start polling spotify for the host's currently playing song
  }

  vote(song, voteDirection) {
    if (
      !localStorage.getItem('spotify_ids') ||
      !JSON.parse(localStorage.getItem('spotify_ids'))[song.spotify_id]
    ) {
      let spotify_ids = JSON.parse(localStorage.getItem('spotify_ids')) || {};
      spotify_ids[song.spotify_id] = voteDirection;
      localStorage.setItem('spotify_ids', JSON.stringify(spotify_ids));

      // Update the song in the db and emit a songVote event to the server socket
      let voteEndpoint =
        voteDirection === 'up' ? '/api/upvoteSong' : '/api/downvoteSong';
      axios
        .post(voteEndpoint, { song })
        .then(() => {
          this.socket.emit('songVote');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // have already voted on song
      if (
        JSON.parse(localStorage.getItem('spotify_ids'))[song.spotify_id] !==
        voteDirection
      ) {
        axios
          .post('/api/changeUserVote', {
            song,
            voteDirection
          })
          .then(() => {
            let spotify_ids = JSON.parse(localStorage.getItem('spotify_ids'));
            spotify_ids[song.spotify_id] = voteDirection;
            localStorage.setItem('spotify_ids', JSON.stringify(spotify_ids));
            this.socket.emit('songVote');
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  async getHostId() {
    // Get the host of the room that you just entered (so all users in the room can use their access token)
    const {
      data: { roomHostId }
    } = await axios.get('/spotify/roomHost');
    this.setState(
      {
        roomHostId
      },
      () => {
        if (this.state.userId === this.state.roomHostId) {
          this.setState({ showBSBBtn: true });
        }
      }
    );
  }

  pollCurrentSong() {
    // Get the current song every five seconds from Spotify and then queue itself back up
    setTimeout(async () => {
      await this.getCurrentSong();
      this.pollCurrentSong();
    }, 5000);
  }

  async getCurrentSong() {
    // Ask Spotify for the host's currently playing song

    // 👇🏼 Should really be inside a try...catch block for legit error handling
    const {
      data: { songData }
    } = await axios.get('/spotify/currentSong');
    console.log('here is all the song data I have: ');
    console.log(songData);

    this.setState({
      currentSong: songData,
      currentLyrics: {
        lyrics: songData.lyrics,
        length: songData.duration_ms,
        progress: songData.progress_ms
      }
    });
  }

  clickBSBmode() {
    axios
      .get('/api/toggleBSBmode')
      .then(() => {
        axios
          .get('/spotify/search', {
            params: {
              q: 'backstreet boys'
            }
          })
          .then(({ data: { items } }) => {
            items.forEach(songObj => {
              this.addSong(songObj);
            });
            return items;
          })
          .then(items => {
            items.forEach(songObjj => {
              axios
                .post('/api/upvoteBSBSong', { song: songObjj })
                .catch(console.log);
            });
          })
          .then(() => {
            axios
              .get('/api/getAllSongs', {
                params: {
                  roomID: this.state.roomID
                }
              })
              .then(({ data }) => {
                this.setState({
                  songBank: data
                });
              })
              .then(() => {
                clearTimeout(this.setPlayNextSong);
                this.playNextSong();
              })
              .catch(console.log);
          })
          .catch(console.log);
      })
      .catch(console.log);
  }

  addSong(song) {
    // Add a song to the current room and emit an addSong event to the server
    axios
      .post('/api/saveSong', { song })
      .then(() => {
        this.socket.emit('addSong');
      })
      .catch(function(error) {
        console.log('POST failed', error);
      });
  }

  skipSong() {
    axios
      .post('/api/skipsong')
      .then(() => {
        this.socket.emit('skipVote');
        this.setState({ showSkipBtn: false });
      })
      .catch(console.log);
  }

  getSkipVoteCount() {
    axios
      .get('/api/skipsong')
      .then(({ data }) => {
        this.setState({ skipVoteCount: data });
      })
      .then(() => {
        if (
          this.state.skipVoteCount > 75 &&
          this.state.userId === this.state.roomHostId
        ) {
          clearTimeout(this.setPlayNextSong);
          this.playNextSong();
        }
      })
      .catch(console.log);
  }

  getAllSongs() {
    // Get all unplayed songs for the current room
    axios
      .get('/api/getAllSongs', {
        params: {
          roomID: this.state.roomID
        }
      })
      .then(({ data }) => {
        this.setState({
          songBank: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getSongStatus() {
    // Poll Spotify for the time remaining on the host's current song
    // Only the host can call this fn so that this.playNextSong can only be
    // invoked from one client (otherwise it would be called once for every
    // person in the room and pop off a ton of songs in the room)
    if (this.state.userId === this.state.roomHostId) {
      // Make sure all timeouts that haven't run are cleared before queueing up the next poll
      clearTimeout(this.updateNextSongTimer);

      this.updateNextSongTimer = setTimeout(async () => {
        // Ask Spotify for info about the currently playing song
        const { data } = await axios.get('/spotify/currentSong');
        const { timeUntilNextSong } = data;

        // Make sure all timeouts that haven't run are cleared before queueing up the next setTimeout
        clearTimeout(this.setPlayNextSong);
        // Ask Spotify to play the next song 1.5s before the current song ends (ensure that there's
        // no dead space while this async fn is happening)
        this.setPlayNextSong = setTimeout(
          this.playNextSong,
          timeUntilNextSong - 1500
        );

        // Queue up the next poll by calling itself
        this.getSongStatus();
      }, 10000);
    }
  }

  async playNextSong() {
    // Only called from within this.getSongStatus
    // Grab the first song from the song bank (highest upvotes - downvotes)
    // and ask Spotify to play it
    const song = this.state.songBank[0];
    const { spotify_id } = song;
    await axios.post(`/spotify/playSong/${spotify_id}`);

    // Once Spotify successfully plays the song, mark the song as played in the db
    // 👇🏼 Shitty mix of asyn/await & promises (some desperate debugging caused this)
    await axios
      .post('/api/markSongPlayed', {
        songObj: song
      })
      .then(() => {
        this.getAllSongs();
        if (this.state.userId === this.state.roomHostId) {
          this.socket.emit('skipVote');
          this.socket.emit('showSkipBtn');
        }
      })
      .catch(console.log);
  }

  componentWillUnmount() {
    // Clear all timeouts when they navigate to another room/render any other component in it's place
    clearTimeout(this.setPlayNextSong);
    clearTimeout(this.updateNextSongTimer);
    localStorage.clear();
  }

  render() {
    let currentSong = this.state.currentSong ? (
      <CurrentSong
        song={this.state.currentSong}
        skipVoteCount={this.state.skipVoteCount}
        skipSong={this.skipSong}
        showSkipBtn={this.state.showSkipBtn}
      />
    ) : (
      ''
    );

    return (
      <div className="main">
        <h1>Welcome to your Avoteio room!</h1>
        {currentSong}
        <div className="center">
          <SongList
            songBank={this.state.songBank}
            dropdownSongs={this.dropdownSongs}
            vote={this.vote}
          />
          <SearchBar
            updateSongBank={this.updateSongBank}
            roomID={this.state.roomID}
            getAllSongs={this.getAllSongs}
            addSong={this.addSong}
          />
          <LyricList currentLyrics={this.state.currentLyrics} />
          <Modes
            showBSBBtn={this.state.showBSBBtn}
            clickBSBmode={this.clickBSBmode}
          />
        </div>
      </div>
    );
  }
}

export default Main;
