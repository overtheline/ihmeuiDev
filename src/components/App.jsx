import React from 'react';
import { assign, bindAll, map } from 'lodash';
import { json } from 'd3';
import {
  ResponsiveContainer,
} from 'ihme-ui';
import FAData from '../../../ihme-ui/src/test-utils/data2';
import CacheTree from '../utils/cachetree';
import colorScale from '../utils/color';

import LineChart from './LineChart';
import ScatterChart from './ScatterChart';
import MapChart from './MapChart';
import Controls from './Controls';

import {
  lineDataConfig,
  mapDataConfig,
} from '../constants/dataConfig';
import {
  locationList,
  yearList,
} from '../constants/metadata';

import {
  lineDataReducer,
  lineDomainReducer,
  lineRangeReducer,
  mapDomainReducer,
} from '../reducers/data';

import styles from './App.css';

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
        <div className={styles['title-container']}>
          <h1>Charts</h1>
        </div>
        <div className={styles['view-container']}>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <LineChart
                animate={{}}
                xDomain={this.state.xDomain}
                yDomain={this.state.yDomain}
                data={this.state.lineData}
                colorScale={colorScale}
                />
            </ResponsiveContainer>
          </div>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <ScatterChart
                animate={{}}
                xDomain={this.state.xDomain}
                yDomain={this.state.yDomain}
                data={this.state.lineData}
                colorScale={colorScale}
                />
            </ResponsiveContainer>
          </div>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <MapChart
                height={100}
                width={100}
                topology={this.state.topology}
                data={this.state.mapData}
                range={this.state.mapDomain}
                selectedChoroplethDomain={this.state.selectedChoroplethDomain}
                onResetScale={this.onResetScale}
                onSliderMove={this.onSliderMove}
                />
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles['controls-container']}>
          <Controls
            onChangeMeasure={this.onChangeMeasure}
            selectedMeasure={this.state.lineSettings.measure}
            />
        </div>
      </div>
    );
  }
}

export default App;
