import React from 'react';
import { Group, Option } from 'ihme-ui';
import { map } from 'lodash';

const data = [
  { name: 'one', value: 1 },
  { name: 'two', value: 2 },
  { name: 'three', value: 3 },
];

class Controls extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedItem: 1,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(_, value) {
    this.setState({
      selectedItem: value,
    });
  }

  render() {
    return (
      <Group onClick={this.onClick}>
        {
          map(
            data,
            datum => (
              <Option
                key={datum.value}
                text={datum.name}
                selected={this.state.selectedItem === datum.value}
                value={datum.value}
              />
            ),
          )
        }
      </Group>
    );
  }
}

export default Controls;
