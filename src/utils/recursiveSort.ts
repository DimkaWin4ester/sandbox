export function recursiveSort<T>(
  array: T[],
  compare: (a: T, b: T) => number
): T[] {
  if (array.length <= 1) return array;
  const pivot = array[0];
  const left = array.slice(1).filter((item) => compare(item, pivot) < 0);
  const right = array.slice(1).filter((item) => compare(item, pivot) >= 0);
  return [
    ...recursiveSort(left, compare),
    pivot,
    ...recursiveSort(right, compare),
  ];
}

export const recursiveSortCode = `
function recursiveSort<T>(
  array: T[],
  compare: (a: T, b: T) => number
): T[] {
  if (array.length <= 1) return array;
  const pivot = array[0];
  const left = array.slice(1).filter((item) => compare(item, pivot) < 0);
  const right = array.slice(1).filter((item) => compare(item, pivot) >= 0);
  return [
    ...recursiveSort(left, compare),
    pivot,
    ...recursiveSort(right, compare),
  ];
}
`;
