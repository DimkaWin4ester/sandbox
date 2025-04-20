export function recursiveFind<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean,
  index: number = 0
): T | undefined {
  if (index >= array.length) return undefined;
  if (predicate(array[index], index)) return array[index];
  return recursiveFind(array, predicate, index + 1);
}

export const recursiveFindCode = `
function recursiveFind<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean,
  index: number = 0
): T | undefined {
  if (index >= array.length) return undefined;
  if (predicate(array[index], index)) return array[index];
  return recursiveFind(array, predicate, index + 1);
}
`;
