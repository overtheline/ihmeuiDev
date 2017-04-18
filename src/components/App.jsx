import React from 'react';
import { range } from 'lodash';
// import styles from './App.css';
// import printFib from './Fib';
import { FAData } from 'ihme-ui';
import CacheTree from '../utils/cachetree';

import { LineChart } from './LineChart';

import dataConfig from '../constants/dataConfig';
import { padding, xDomain, yDomain } from '../constants/lineChartDims';
import { locationList, measureList } from '../constants/metadata';

import { lineDataReducer } from '../reducers/lineData';

// development components
import Timer from '../../../ihme-ui/src/ui/animate/src/utils/Timer.js';

const dataGenerator = new FAData(dataConfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.cache = new CacheTree(['measure', 'risk', 'type', 'location', 'year'], 1000);

    this.state = {
      cache: this.cache,
      lineSettings: {
        measure: 'A',
        risk: 123,
        type: 1,
        location: locationList,
        year: range(xDomain[0], xDomain[1] + 1),
      },
      lineData: [],
    };
  }

  componentWillMount() {
    const initialData = dataGenerator.getData(this.state.lineSettings);

    this.cache.set(initialData);

    this.state.lineData = lineDataReducer(initialData);
  }

  render() {
    return (
      <div>
        <h1>Charts</h1>
        <LineChart
          width={400}
          height={400}
          padding={padding}
          xDomain={xDomain}
          yDomain={yDomain}
          data={this.state.lineData}
        />
      </div>
    );
  }
}

export { App };
