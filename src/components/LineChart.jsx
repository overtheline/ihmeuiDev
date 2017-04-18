import React, { PropTypes } from 'react';
import {
  AxisChart,
  XAxis,
  YAxis,
  MultiLine,
} from 'ihme-ui';

const fieldAccessors = {
  data: 'values',
  key: 'key',
};

const dataAccessors = {
  x: 'year',
  y: 'mean',
  y0: 'mean_lb',
  y1: 'mean_ub',
};

const areaStyle = {
  fillOpacity: 0.5,
};

export class LineChart extends React.Component {
  render() {
    const {
      width,
      height,
      padding,
      xDomain,
      yDomain,
      data,
    } = this.props;

    return (
      <AxisChart
        width={width}
        height={height}
        padding={padding}
        xDomain={xDomain}
        yDomain={yDomain}
      >
        <MultiLine
          areaStyle={areaStyle}
          data={data}
          dataAccessors={dataAccessors}
          fieldAccessors={fieldAccessors}
        />
        <XAxis />
        <YAxis />
      </AxisChart>
    );
  }
}

LineChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.object.isRequired,
  xDomain: PropTypes.array.isRequired,
  yDomain: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};
