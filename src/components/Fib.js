export default function printFib() {
  const list = [1, 1];
  for (let i = list.length; i < 100; i++) {
    list.push(list[i - 1] + list[i - 2]);
  }

  return list;
}
