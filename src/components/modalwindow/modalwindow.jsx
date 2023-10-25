import React from 'react'
import CloseButton from '../closebutton/closebutton.jsx';
import './modalwindow.scss';

const ModalWindow = (props) => {
  const isActive = () => {
    return `${props.active ? 'modalwindow--active' : ''}`;
  }

  return (
    <div className={ `modalwindow ${isActive()}` }>
      <CloseButton closeAction={ props.closeAction } />
      <div className="modalWindow__content">
        { props.children }
      </div>
    </div>
  );
}

export default ModalWindow;