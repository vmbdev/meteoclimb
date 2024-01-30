import React from 'react';
import PropTypes from 'prop-types';

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

TempSelector.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
}

export default TempSelector;
