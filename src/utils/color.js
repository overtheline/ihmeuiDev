import { has } from 'lodash';

const colors = ['#e50909', '#910808', '#219108', '#5de23f', '#3f78e2', '#0b41a5', '#8b0ba5'];
const keys = {};
let i = 0;

export default function colorScale(key) {
  if (has(keys, key)) {
    return keys[key];
  }

  keys[key] = colors[i];
  i += 1;
  i %= colors.length;

  return colors[i];
}
