import { Row } from "@tanstack/react-table";

type FormatCurrencyOptions = {
  locale: string | undefined | null;
  currency: string | undefined | null;
};

type FormatDateOptions = {
  locale?: string | undefined | null;
};

export function formatCurrency(
  amount: number,
  options?: FormatCurrencyOptions
): string {
  const { locale, currency } = options || {};
  try {
    const formatted = new Intl.NumberFormat(locale || "en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);

    return formatted;
  } catch (error) {
    console.error({ error, message: "Error formatting currency" });
    return "Could not format currency.";
  }
}

export function formatDate(date: Date, options?: FormatDateOptions) {
  const { locale } = options || {};
  try {
    const formatted = new Intl.DateTimeFormat(locale || "en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

    return formatted;
  } catch (error) {
    console.error({ error, message: "Error formatting date" });
    return "Could not format date.";
  }
}

export function tagsFilterFn<TData>(
  row: Row<TData>,
  _: string,
  filterValue: any
) {
  const tags = row.getValue("tags") as string;
  const foundTag = splitTags(tags).find((tag) => filterValue.includes(tag));
  return !!foundTag;
}

export function splitTags(tags: string) {
  return tags.split(",").map((tag) => tag.trim());
}

export function joinTags(tags: string[]) {
  return tags.join(",");
}
