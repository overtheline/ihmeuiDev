import React, { PropTypes } from 'react';
import Map from '../../../ihme-ui/src/ui/compositions/map';

const MapChart = function mapChart(props) {
  const {
    topology,
    data,
    selectedChoroplethDomain,
    range,
    onResetScale,
    onSliderMove,
  } = props;

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
      unit="Total of death"
      valueField={'mean'}
    />
  );
};

MapChart.propTypes = {
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
