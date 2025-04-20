export function recursiveForEach<T>(
  array: T[],
  callback: (item: T, index: number) => void,
  index: number = 0
): void {
  if (index >= array.length) return;
  callback(array[index], index);
  recursiveForEach(array, callback, index + 1);
}

export const recursiveForEachCode = `
function recursiveForEach<T>(
  array: T[],
  callback: (item: T, index: number) => void,
  index: number = 0
): void {
  if (index >= array.length) return;
  callback(array[index], index);
  recursiveForEach(array, callback, index + 1);
}
`;
