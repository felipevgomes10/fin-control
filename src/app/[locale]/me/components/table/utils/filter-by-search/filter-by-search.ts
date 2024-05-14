export function filterBySearch<T>(search: string, keys: any[], data: T[]): T[] {
  const searchTerm = search.toLowerCase();
  const filteredData = data.filter((item) => {
    return keys.some((key) => {
      const value = item[key as keyof T];
      const isString = typeof value === "string";
      return isString && value.toLowerCase().includes(searchTerm);
    });
  });
  return filteredData;
}
