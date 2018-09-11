import React, { Component } from 'react';
import Main from './Main/Main.jsx'
import CreateRoom from './CreateRoom.jsx'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'CreateRoom',
      roomID:1
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this)
    this.setRoomID = this.setRoomID.bind(this)
  }

  changeCurrentPage (newPage) {
    this.setState({
      currentPage: newPage
    })
  }

  setRoomID (roomID) {
    this.setState({
      roomID:roomID
    })
  }

  render() {
    let component;
    if(this.state.currentPage === 'Login') {
      // component = <Login />
    } else if (this.state.currentPage === 'CreateRoom') {
      component = <CreateRoom changeCurrentPage={this.changeCurrentPage} setRoomID={this.setRoomID}/>
    } else if (this.state.currentPage === 'Main') {
      component = <Main />
    }
    // console.log(data.tracks.items);
    return (
      <div>
        
        {component}
        {console.log('here are my app state',this.state)}
      </div>
    )
  }
}

export default App;