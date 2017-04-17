import React from 'react';
import { render } from 'react-dom';
import { assign, filter, indexOf, isEmpty, map, maxBy, minBy, range, pull } from 'lodash';
import { json, scaleOrdinal } from 'd3';

import AxisChart from '../../axis-chart';
import { Map } from '../../compositions';
import { MultiLine } from '../../shape';
import { XAxis, YAxis } from '../../axis';
import Button from '../../button';
import FAData from '../../../test-utils/data2.js';

import CacheTree from './cachetree';

const dataConfig = {
  primaryKeyFields: ['measure', 'risk', 'type', 'location'],
  seriesKeyFields: [
    {
      key: 'year',
      model: 'randomModel',
    },
  ],
  dataKeyField: {
    key: 'mean',
    uncertainty: ['mean_lb', 'mean_ub'],
  },
};

const dataGenerator = new FAData(dataConfig);

const width = 600;
const height = 300;
const padding = { top: 20, bottom: 40, left: 55, right: 20 };
const xDomain = [2000, 2025];
const dataAccessors = {
  x: 'year',
  y: 'mean',
  y0: 'mean_lb',
  y1: 'mean_ub',
};
const fieldAccessors = {
  data: 'values',
  key: 'location',
};
const areaStyle = {
  fillOpacity: 0.5,
};
const mapStyle = {
  height,
  width,
};

const locationList = [102, 101, 123, 155, 171];
const measureList = ['A', 'B', 'C', 'D'];
const colors = ['red', 'blue', 'orange', 'green', 'salmon', 'violet'];
const colorScale = scaleOrdinal().domain(locationList)
  .range(map(locationList, (loc, i) => colors[i % colors.length]));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.cache = new CacheTree(['measure', 'risk', 'type', 'location', 'year'], 1000);

    this.state = {
      cache: this.cache,
      settings: {
        measure: 'A',
        risk: 123,
        type: 1,
        location: locationList,
        year: range(xDomain[0], (xDomain[1] + 1)),
      },
      choroplethSettings: {
        measure: 'A',
        risk: 123,
        type: 1,
        location: locationList,
        year: 2000,
        selectedChoroplethDomain: [0, 1],
      }
    };

    this.onClick = this.onClick.bind(this);
    this.onSliderMove = this.onSliderMove.bind(this);
    this.onResetScale = this.onResetScale.bind(this);
    this.onChoroplethClick = this.onChoroplethClick.bind(this);
  }

  componentWillMount() {
    this.cache.set(dataGenerator.getData(this.state.settings));
  }

  onClick() {
    const settings = this.state.settings;
    const choroplethSettings = this.state.choroplethSettings;

    const currentMeasure = settings.measure;
    const index = indexOf(measureList, currentMeasure);
    const nextMeasure = measureList[(index + 1) % measureList.length];

    const newSettings = assign({}, settings, { measure: nextMeasure });
    const newChoroplethSettings = assign({}, choroplethSettings, { measure: nextMeasure });

    if (!this.cache.has(newSettings)) {
      console.log('get settings data');
      const missing = this.cache.getDiff(newSettings);
      console.log('settings', newSettings);
      console.log('diff', missing);
      if (!isEmpty(missing)) {
        this.cache.set(dataGenerator.getData(missing));
      }
    }

    this.setState(assign({} , this.state, { settings: newSettings, choroplethSettings: newChoroplethSettings }));
  }

  onChoroplethClick(event, datum, path) {
    const locId = Number(path.props.feature.properties.loc_id);
    const locIdIndex = indexOf(locationList, locId);
    if (locIdIndex < 0) {
      locationList.push(locId);
    } else {
      pull(locationList, locId);
    }

    const settings = this.state.settings;

    if (!this.cache.has(settings)) {
      console.log('get settings data');
      const missing = this.cache.getDiff(settings);
      console.log('settings', settings);
      console.log('diff', missing);
      this.cache.set(dataGenerator.getData(missing));
    }

    this.setState(assign({}, this.state));
  }

  onSliderMove(selectedChoroplethDomain) {
    const nextSettings = assign({}, this.state.choroplethSettings, { selectedChoroplethDomain });
    this.setState(assign({}, this.state, { choroplethSettings: nextSettings }));
  }

  onResetScale() {
    const resetSettings = assign({}, this.state.choroplethSettings, { selectedChoroplethDomain: [0, 1] });
    this.setState(assign({}, this.state, { choroplethSettings: resetSettings }));
  }

  render() {
    console.log('render');
    const measure = this.state.settings.measure;
    const timeData = this.cache.get(this.state.settings);
    const lineData = map(
      locationList,
      (location) => {
        const locationData = filter(timeData, { location });
        return {
          location,
          values: locationData,
        };
      }
    );
    const choroplethData = this.cache.get(this.state.choroplethSettings);
    const choroplethRange = [minBy(choroplethData, 'mean').mean, maxBy(choroplethData, 'mean').mean];
    const selectedChoroplethDomain = this.state.choroplethSettings.selectedChoroplethDomain;

    const yDomain = [minBy(timeData, 'mean_lb').mean_lb, maxBy(timeData, 'mean_ub').mean_ub];

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <Button
            text="Change data"
            onClick={this.onClick}
          />
        </div>
        <AxisChart
          width={width}
          height={height}
          padding={padding}
          xDomain={xDomain}
          yDomain={yDomain}
        >
          <MultiLine
            areaStyle={areaStyle}
            colorScale={colorScale}
            data={lineData}
            dataAccessors={dataAccessors}
            fieldAccessors={fieldAccessors}
          />
          <XAxis label="Year" />
          <YAxis label={`measure: ${measure}`} />
        </AxisChart>
        <Map
          data={choroplethData}
          mapStyle={mapStyle}
          domain={choroplethRange}
          extentPct={selectedChoroplethDomain}
          geometryKeyField="properties.loc_id"
          keyField="location"
          onClick={this.onChoroplethClick}
          onSliderMove={this.onSliderMove}
          onResetScale={this.onResetScale}
          topology={this.props.topology}
          valueField="mean"
        />
      </div>
    );
  }
}

json("world.topo.json", function(error, topology) {
  if (error) throw error;
  render(<App topology={topology} />, document.getElementById('app'));
});
