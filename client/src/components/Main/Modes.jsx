import React from 'react';

const Modes = (props) => {
  let btn = props.showBSBBtn ? <button onClick={() => { props.clickBSBmode() }}>BSB Mode</button> : '';
  return (
    <div>
      {btn}
    </div>
  );
};

export default Modes;