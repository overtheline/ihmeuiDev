import { groupBy, map, sortBy } from 'lodash';

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

export function mapDataReducer(data) {
  return data;
}
