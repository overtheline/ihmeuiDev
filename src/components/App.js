import React from 'react';
import styles from './App.css';
import printFib from './Fib';
import { FAData } from 'ihme-ui';
import CacheTree from '../utils/cachetree';
import { range } from 'lodash';

import { default as LineChart } from './LineChart.jsx';

import dataConfig from '../constants/dataConfig';
import { padding, xDomain, yDomain } from '../constants/lineChartDims';
import { locationList, measureList } from '../constants/metadata';

// development components
import Timer from '../../../ihme-ui/src/ui/animate/src/utils/Timer.js';

const dataGenerator = new FAData(dataConfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.cache = new CacheTree(['measure', 'risk', 'type', 'location', 'year'], 1000);

    this.state = {
      cache: this.cache,
      settings: {
        line: {
          measure: 'A',
          risk: 123,
          type: 1,
          location: locationList,
          year: range(xDomain[0], xDomain[1] + 1),
        }
      },
      data: {
        line: [],
      },
    };
  }

  componentWillMount() {
    const initialData = dataGenerator.getData(this.state.settings.line);
    this.cache.set(initialData);
  }

  componentDidMount() {
    const data = this.cache.get(this.state.settings.line);
    this.setState({
      data: {
        line: data,
      },
    })
    console.log(data);
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <LineChart
          width={400}
          height={400}
          padding={padding}
          xDomain={xDomain}
          yDomain={yDomain}
          data={this.state.data.line}
        />
      </div>
    );
  }
}

export default App;
