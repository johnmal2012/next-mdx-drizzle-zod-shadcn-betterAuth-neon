export type SectionMap = Record<
  string,
  {
    title: string;
    content: string;
  }
>;

// how many items should be in each chunk e.g. 2 items per row
// T[] = [section1, section2]
// T[][] = [[section1, section2], [section3, section4]]
// The outer array contains rows. Each inner array contains the sections in that row
// Array.from() = create a new array from an (a) array-like = is an object that looks like an array because it has: 1. a length property 2. Indexed properties (0, 1, 2, ...); however, it is not actually an Array, so it doesn't have array methods like .map(), .filter(), or .push() e.g. arguments, NodeList, HTMLCollection or (b) iterable object; use when you already know how many items you want to generate
// const rows = [] = se this when you don't know beforehand how many items you'll have or when there is conditional logic
// parameters to Array.from = 1. array-like = required; 2. mapFn = called for every element as the array is being created = optional; 3. thisArg = optional; rarely used; specifies what this refers to inside the callback
export function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );
}
