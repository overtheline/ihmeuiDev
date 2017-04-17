import React, { PropTypes } from 'react';
import { groupdBy, map, reduce } from 'lodash';
import {
  AxisChart,
  XAxis,
  YAxis,
} from 'ihme-ui';

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const multiLineData = this.processData(nextProps.data);
  }

  processData(data) {
    const groupedByLocation = groupdBy(data, 'location')

    console.log(groupedByLocation);
  }

  render() {
    const {
      width,
      height,
      padding,
      xDomain,
      yDomain,
      data,
    } = this.props;
    console.log(data);

    return (
      <AxisChart
        width={width}
        height={height}
        padding={padding}
        xDomain={xDomain}
        yDomain={yDomain}
      >
        <XAxis/>
        <YAxis/>
      </AxisChart>
    );
  }
}

LineChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.object,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  data: PropTypes.array,
};
