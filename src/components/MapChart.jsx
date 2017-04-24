import React, { PropTypes } from 'react';
import Map from '../../../ihme-ui/src/ui/compositions/map';

const MapChart = function mapChart(props) {
  const {
    height,
    width,
    topology,
    data,
    selectedChoroplethDomain,
    range,
    onResetScale,
    onSliderMove,
  } = props;

  const style = { height, width };

  if (!topology) return null;

  return (
    <Map
      data={data}
      domain={range}
      extentPct={selectedChoroplethDomain}
      geometryKeyField={'properties.loc_id'}
      keyField={'location'}
      onResetScale={onResetScale}
      onSliderMove={onSliderMove}
      topology={topology}
      unit="Total deaths"
      valueField={'mean'}
      style={style}
    />
  );
};

MapChart.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  topology: PropTypes.shape({
    objects: PropTypes.object.isRequired,
  }).isRequired,
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedChoroplethDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  onResetScale: PropTypes.func.isRequired,
  onSliderMove: PropTypes.func.isRequired,
};

export default MapChart;
