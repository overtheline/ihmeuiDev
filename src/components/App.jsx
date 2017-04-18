import React from 'react';
import { assign } from 'lodash';
// import styles from './App.css';
// import printFib from './Fib';
import FAData from '../../../ihme-ui/src/test-utils/data2';
import CacheTree from '../utils/cachetree';

import LineChart from './LineChart';
import Controls from './Controls';

import dataConfig from '../constants/dataConfig';
import { locationList, yearList } from '../constants/metadata';

import { lineDataReducer, lineDomainReducer, lineRangeReducer } from '../reducers/lineData';

// development components
// import Timer from '../../../ihme-ui/src/ui/animate/src/utils/Timer';

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

    this.onChangeMeasure = this.onChangeMeasure.bind(this);
  }

  componentWillMount() {
    const initialData = dataGenerator.getData(this.state.lineSettings);

    this.cache.set(initialData);

    this.state.xDomain = lineDomainReducer(initialData);
    this.state.yDomain = lineRangeReducer(initialData);
    this.state.lineData = lineDataReducer(initialData);
  }

  onChangeMeasure(_, nextMeasure) {
    const lineSettings = assign({}, this.state.lineSettings, { measure: nextMeasure });
    let nextData;

    if (this.cache.has(lineSettings)) {
      nextData = this.cache.get(lineSettings);
    } else {
      nextData = dataGenerator.getData(this.state.lineSettings);
    }

    this.setState({
      lineSettings,
      lineData: lineDataReducer(nextData),
      xDomain: lineDomainReducer(nextData),
      yDomain: lineRangeReducer(nextData),
    });
  }

  render() {
    return (
      <div>
        <h1>Charts</h1>
        <LineChart
          width={800}
          height={400}
          xDomain={this.state.xDomain}
          yDomain={this.state.yDomain}
          data={this.state.lineData}
        />
        <Controls
          onChangeMeasure={this.onChangeMeasure}
          selectedMeasure={this.state.lineSettings.measure}
        />
      </div>
    );
  }
}

export default App;
