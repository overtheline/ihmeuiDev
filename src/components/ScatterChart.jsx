import React, { PropTypes } from 'react';
import {
  AxisChart,
  XAxis,
  YAxis,
} from 'ihme-ui';
import MultiScatter from '../../../ihme-ui/src/ui/shape/src/multi-scatter';

export const padding = {
  top: 20,
  bottom: 40,
  left: 50,
  right: 20,
};

const fieldAccessors = {
  data: 'values',
  key: 'key',
};

const dataAccessors = {
  x: 'year',
  y: 'mean',
  key: 'id',
  fill: 'location',
};

const ScatterChart = function scatterChart(props) {
  const {
    width,
    height,
    xDomain,
    yDomain,
    data,
    colorScale,
  } = props;

  return (
    <AxisChart
      clipPath
      width={width}
      height={height}
      padding={padding}
      xDomain={xDomain}
      yDomain={yDomain}
    >
      <MultiScatter
        colorScale={colorScale}
        data={data}
        dataAccessors={dataAccessors}
        fieldAccessors={fieldAccessors}
      />
      <XAxis />
      <YAxis />
    </AxisChart>
  );
};

ScatterChart.propTypes = {
  colorScale: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  xDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  yDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      values: PropTypes.arrayOf(
        PropTypes.shape({
          location: PropTypes.number,
          mean: PropTypes.number,
          mean_lb: PropTypes.number,
          mean_ub: PropTypes.number,
          measure: PropTypes.string,
          risk: PropTypes.number,
          type: PropTypes.number,
          year: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
};

export default ScatterChart;
