export function filterBySearch<T>(
  search: string,
  data: T[],
  keys: (keyof T)[]
): T[] {
  const searchTerm = search.toLowerCase();
  const filteredData = data.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      const isString = typeof value === "string";
      return isString && value.toLowerCase().includes(searchTerm);
    });
  });
  return filteredData;
}
