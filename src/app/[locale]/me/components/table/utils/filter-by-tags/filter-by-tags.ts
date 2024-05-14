import { splitTags } from "../../utils";

export function filterByTags<T>(tags: string[], data: T[]) {
  if (!tags.length) return data;
  const filteredData = data.filter((item) => {
    const castedItem = item as { tags: string };
    const itemTags = splitTags(castedItem.tags);
    return itemTags.find((tag) => tags.includes(tag));
  });
  return filteredData;
}
