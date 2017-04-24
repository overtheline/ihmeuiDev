import { assign, forEach, groupBy, map, reduce, sortBy } from 'lodash';

function getBounds(...params) {
  return (acc, datum) => {
    let [min, max] = acc;

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
  // append id to data
  const augmentedData = map(data, (datum, index) => assign(datum, { id: index }));
  const locationGroupedData = groupBy(augmentedData, 'location');

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

export function mapDomainReducer(data) {
  return reduce(data, getBounds('mean'), [Infinity, -Infinity]);
}
