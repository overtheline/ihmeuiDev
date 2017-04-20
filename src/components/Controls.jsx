import React, { PropTypes } from 'react';
import { Group, Option } from 'ihme-ui';
import { map } from 'lodash';

import { measureList } from '../constants/metadata';

const data = map(measureList, m => ({ name: `Measure: ${m}`, value: m }));

const Controls = function controls(props) {
  const {
    onChangeMeasure,
    selectedMeasure,
  } = props;

  return (
    <Group onClick={onChangeMeasure}>
      {
        map(
          data,
          datum => (
            <Option
              key={datum.value}
              text={datum.name}
              selected={selectedMeasure === datum.value}
              value={datum.value}
            />
          ),
        )
      }
    </Group>
  );
};

Controls.propTypes = {
  onChangeMeasure: PropTypes.func.isRequired,
  selectedMeasure: PropTypes.string.isRequired,
};

export default Controls;
