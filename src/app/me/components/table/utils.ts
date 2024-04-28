type FormatCurrencyOptions = {
  locale: string;
  currency: string;
};

type FormatDateOptions = {
  locale: string;
};

export function formatCurrency(
  amount: number,
  options?: FormatCurrencyOptions,
): string {
  const { locale = "en-US", currency = "USD" } = options || {};
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);

    return formatted;
  } catch (error) {
    console.error({ error, message: "Error formatting currency" });
    return "Could not format currency.";
  }
}

export function formatDate(date: Date, options?: FormatDateOptions) {
  const { locale = "en-US" } = options || {};
  try {
    const formatted = new Intl.DateTimeFormat(locale, {
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
