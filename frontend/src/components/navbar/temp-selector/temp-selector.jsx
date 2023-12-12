import React from 'react';
import ButtonGroup from '../../button-group/button-group';

const TempSelector = ({ selected, onChange }) => {
  return (
    <ButtonGroup
      selected={selected}
      onChange={onChange}
      buttons={[
        { text: 'ºF', val: 'fahrenheit' },
        { text: 'ºC', val: 'celsius' },
      ]}
    />
  );
};

export default TempSelector;
