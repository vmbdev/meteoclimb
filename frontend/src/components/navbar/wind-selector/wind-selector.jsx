import React from 'react';
import PropTypes from 'prop-types';

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

WindSelector.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
}

export default WindSelector;
