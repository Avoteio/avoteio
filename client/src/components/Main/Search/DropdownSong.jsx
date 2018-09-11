import React from 'react';


const DropdownSong = (props) => (

      <div>
        
          {console.log('Dropdown song props:',props)}
          <div onClick={props.selectSong}>{props.title} by {props.artist}</div>
           
          
      </div>
  
    
)



export default DropdownSong