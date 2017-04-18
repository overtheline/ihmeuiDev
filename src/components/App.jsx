import React from 'react';
// import styles from './App.css';
// import printFib from './Fib';
import { FAData } from 'ihme-ui';
import CacheTree from '../utils/cachetree';

import LineChart from './LineChart';

import dataConfig from '../constants/dataConfig';
import { locationList, yearList } from '../constants/metadata';

import { lineDataReducer, lineDomainReducer, lineRangeReducer } from '../reducers/lineData';

// development components
// import Timer from '../../../ihme-ui/src/ui/animate/src/utils/Timer.js';

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
        year: yearList,
      },
      lineData: [],
      lineDomain: [],
    };
  }

  componentWillMount() {
    const initialData = dataGenerator.getData(this.state.lineSettings);

    this.cache.set(initialData);

    this.state.xDomain = lineDomainReducer(initialData);
    this.state.yDomain = lineRangeReducer(initialData);
    this.state.lineData = lineDataReducer(initialData);
  }

  render() {
    return (
      <div>
        <h1>Charts</h1>
        <LineChart
          width={400}
          height={400}
          xDomain={this.state.xDomain}
          yDomain={this.state.yDomain}
          data={this.state.lineData}
        />
      </div>
    );
  }
}

export default App;
