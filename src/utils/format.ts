import i18n from "../i18n";

export function formatNumber(value: number) {
  try {
    return new Intl.NumberFormat(i18n.language).format(value);
  } catch {
    return String(value);
  }
}

export function formatCurrency(value: number, currency = "JPY") {
  try {
    // Use currency formatting from Intl. Different locales will render appropriately.
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

export function formatCount(value: number) {
  // Default to number formatting; plural/suffix should be provided by translation keys
  return formatNumber(value);
}
