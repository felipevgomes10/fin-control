type FormatCurrencyOptions = {
  locale: string;
  currency: string;
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
