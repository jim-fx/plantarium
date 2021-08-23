export default function groupArray<T>(arr: ArrayLike<T>, groupSize: number) {
  const output: T[][] = [];

  const groupAmount = arr.length / groupSize;

  for (let i = 0; i < groupAmount; i++) {
    const group = [];
    for (let j = 0; j < groupSize; j++) {
      group[j] = arr[i * groupSize + j];
    }
    output.push(group);
  }

  return output;
}
