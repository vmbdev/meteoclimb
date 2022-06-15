import React from 'react'
import CloseButton from './closebutton.js';
import './modalwindow.scss';

const ModalWindow = (props) => {
  return (
    <div className={ `modalwindow ${props.active ? 'modalwindow--active' : ''}` }>
      <CloseButton closeAction={ props.closeAction } />
      <div className="modalWindow__content">
        { props.children }
      </div>
    </div>
  );
}

export default ModalWindow;