import React from 'react';
import { assign } from 'lodash';
import styles from './App.css';
// import printFib from './Fib';
import FAData from '../../../ihme-ui/src/test-utils/data2';
import CacheTree from '../utils/cachetree';
import colorScale from '../utils/color';

import LineChart from './LineChart';
import ScatterChart from './ScatterChart';
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
    this.cache = new CacheTree(['measure', 'risk', 'type', 'location', 'year'], 100000);

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
      nextData = dataGenerator.getData(lineSettings);
      this.cache.set(nextData);
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
      <div className={styles.app}>
        <h1>Charts</h1>
        <div className={styles['charts-container']}>
          <div className={styles.chart}>
            <LineChart
              width={500}
              height={300}
              xDomain={this.state.xDomain}
              yDomain={this.state.yDomain}
              data={this.state.lineData}
              colorScale={colorScale}
            />
          </div>
          <div className={styles.chart}>
            <ScatterChart
              width={500}
              height={300}
              xDomain={this.state.xDomain}
              yDomain={this.state.yDomain}
              data={this.state.lineData}
              colorScale={colorScale}
            />
          </div>
        </div>
        <Controls
          onChangeMeasure={this.onChangeMeasure}
          selectedMeasure={this.state.lineSettings.measure}
        />
      </div>
    );
  }
}

export default App;
