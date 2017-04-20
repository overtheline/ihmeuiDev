import React from 'react';
import { assign, bindAll, map } from 'lodash';
import { json } from 'd3';
import styles from './App.css';
// import printFib from './Fib';
import FAData from '../../../ihme-ui/src/test-utils/data2';
import CacheTree from '../utils/cachetree';
import colorScale from '../utils/color';

import LineChart from './LineChart';
import ScatterChart from './ScatterChart';
import MapChart from './MapChart';
import Controls from './Controls';

import { lineDataConfig, mapDataConfig } from '../constants/dataConfig';
import { locationList, yearList } from '../constants/metadata';

import { lineDataReducer, lineDomainReducer, lineRangeReducer, mapDomainReducer } from '../reducers/data';

// development components
// import Timer from '../../../ihme-ui/src/ui/animate/src/utils/Timer';

const lineDataGenerator = new FAData(lineDataConfig);
const mapDataGenerator = new FAData(mapDataConfig);

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
      mapSettings: {
        measure: 'A',
        risk: 123,
        type: 1,
        location: [],
        year: 2000,
      },
      mapData: [{}],
      mapDomain: [0, 1],
      selectedChoroplethDomain: [0, 1],
    };

    bindAll(this, [
      'onResetScale',
      'onSliderMove',
      'onChangeMeasure',
    ]);
  }

  componentWillMount() {
    const initialLineData = lineDataGenerator.getData(this.state.lineSettings);
    this.cache.set(initialLineData);
    this.state.xDomain = lineDomainReducer(initialLineData);
    this.state.yDomain = lineRangeReducer(initialLineData);
    this.state.lineData = lineDataReducer(initialLineData);
  }

  componentDidMount() {
    json('world.topo.json', (error, topology) => {
      if (error) throw error;

      this.setState({ topology });

      const choroplethLocationList = map(
        topology.objects.national.geometries,
        geo => Number(geo.properties.loc_id),
      );
      const mapSettings = assign({}, this.state.mapSettings, { location: choroplethLocationList });
      const mapData = mapDataGenerator.getData(mapSettings);

      this.cache.set(mapData);
      this.setState({
        mapSettings,
        mapData,
        mapDomain: mapDomainReducer(mapData),
      });
    });
  }

  onChangeMeasure(_, nextMeasure) {
    const lineSettings = assign({}, this.state.lineSettings, { measure: nextMeasure });
    let nextData;

    if (this.cache.has(lineSettings)) {
      nextData = this.cache.get(lineSettings);
    } else {
      nextData = lineDataGenerator.getData(lineSettings);
      this.cache.set(nextData);
    }

    this.setState({
      lineSettings,
      lineData: lineDataReducer(nextData),
      xDomain: lineDomainReducer(nextData),
      yDomain: lineRangeReducer(nextData),
    });
  }

  onSliderMove(selectedChoroplethDomain) {
    this.setState({
      selectedChoroplethDomain,
    });
  }

  onResetScale() {
    this.setState({
      selectedChoroplethDomain: [0, 1],
    });
  }

  render() {
    return (
      <div className={styles.app}>
        <h1>Charts</h1>
        <div className={styles['charts-container']}>
          <div className={styles.chart}>
            <p>This chart animates on the path in the line component.</p>
            <LineChart
              animate={{}}
              width={500}
              height={250}
              xDomain={this.state.xDomain}
              yDomain={this.state.yDomain}
              data={this.state.lineData}
              colorScale={colorScale}
            />
          </div>
          <div className={styles.chart}>
            <p>This chart animates on the path in the shape component.</p>
            <ScatterChart
              animate={{}}
              width={500}
              height={250}
              xDomain={this.state.xDomain}
              yDomain={this.state.yDomain}
              data={this.state.lineData}
              colorScale={colorScale}
            />
          </div>
        </div>
        <div className={styles['map-chart-container']}>
          <MapChart
            topology={this.state.topology}
            data={this.state.mapData}
            range={this.state.mapDomain}
            selectedChoroplethDomain={this.state.selectedChoroplethDomain}
            onResetScale={this.onResetScale}
            onSliderMove={this.onSliderMove}
          />
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
