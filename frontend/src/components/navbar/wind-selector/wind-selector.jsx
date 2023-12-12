import React from 'react';
import ButtonGroup from '../../button-group/button-group';

const WindSelector = ({ selected, onChange }) => {
  return (
    <ButtonGroup
      selected={selected}
      onChange={onChange}
      buttons={[
        { text: 'km/h', val: 'km/h' },
        { text: 'mph', val: 'mph' },
        { text: 'm/s', val: 'm/s' },
        { text: 'ft/s', val: 'ft/s' },
        { text: 'knots', val: 'knots' },
      ]}
    />
  );
};

export default WindSelector;
