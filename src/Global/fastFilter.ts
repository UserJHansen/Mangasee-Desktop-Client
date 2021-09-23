export default function fastFilter(
  fn: (e: never) => boolean,
  a: never[]
): never[] {
  const f: never[] = []; // Final Array
  for (let i = 0; i < a?.length; i += 1) {
    if (fn(a[i])) {
      f.push(a[i]);
    }
  }
  return f;
}
