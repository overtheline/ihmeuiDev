import { forEach, groupBy, map, reduce, sortBy } from 'lodash';

function getBounds(...params) {
  return (acc, datum) => {
    let min = acc[0];
    let max = acc[1];

    forEach(params, (param) => {
      if (datum[param] < min) {
        min = datum[param];
      } else if (max < datum[param]) {
        max = datum[param];
      }
    });

    return [min, max];
  };
}

export function lineDataReducer(data) {
  const locationGroupedData = groupBy(data, 'location');

  const locationData = map(locationGroupedData, (values, key) => (
    {
      key,
      values: sortBy(values, value => value.year),
    }
  ));

  return locationData;
}

export function lineDomainReducer(data) {
  return reduce(data, getBounds('year'), [Infinity, -Infinity]);
}

export function lineRangeReducer(data) {
  return reduce(data, getBounds('mean', 'mean_lb', 'mean_ub'), [Infinity, -Infinity]);
}
