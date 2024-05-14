type Filter<T> = (data: T[]) => T[];

export function applyFilters<T>(data: T[], filters: Filter<T>[]): T[] {
  return filters.reduce((filteredData, filter) => {
    return filter(filteredData);
  }, data);
}
