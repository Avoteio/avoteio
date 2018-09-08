import React, { Component } from 'react';
import {data} from '../dummy_data.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    console.log(data.tracks.items);
    return (
      <h1>Howdy, World!</h1>
    );
  }
}

export default App;