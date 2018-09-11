import React, { Component } from 'react';


class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
        input: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  handleInputChange (e) {
    this.setState({
        input:e.target.value
    })
  }

  handleClick(e) {
    //update the main songBank from Database
    e.preventDefault()
    this.props.setRoomID(2)

    //axios.post('/createRoom', {
//    roomName:''
//   })
//   .then(function (response) {
    // this.props.setRoomID(response)
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

    this.props.changeCurrentPage("Main")
  }

  render() {
    return (
     <div>
         {/* {console.log('here are search props',this.props)} */}
         <h1>Create A Room</h1>
         <form action=""  >
             <input type="text" value={this.state.input} onChange={this.handleInputChange} />
             <button onClick={(e)=>this.handleClick(e)}>button</button>

         </form>
     </div>
    );
  }
}

export default CreateRoom;