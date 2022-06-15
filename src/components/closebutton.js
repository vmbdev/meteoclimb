import React from 'react'
import './closebutton.scss';

const CloseButton = (props) => {

  return (
    <button
      className="closebutton"
      onClick={ props.closeAction }>&#10006;
    </button>
  );
}

export default CloseButton;