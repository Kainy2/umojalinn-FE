export function formatNumberTo2DecimalPlace(value: number): string {
  // Check if the value has a fractional part
  const isWholeNumber = value === Math.trunc(value);

  // Return the number formatted based on its type
  return isWholeNumber ? value.toFixed(0) : value.toFixed(2);
}

export function formatCurrencyValue(amount?: number | null): string {
  // Handle edge cases where the amount is not a number or is null/undefined
  if ((amount !== 0 && !amount) || isNaN(amount)) {
    return "";
  }

  // Use Intl.NumberFormat for currency formatting
  const options: Intl.NumberFormatOptions = {
    style: "decimal", // We want plain decimal (not currency symbol for now)
    minimumFractionDigits: 0, // At least 0 decimal places
    maximumFractionDigits: 2, // Maximum 2 decimal places
  };

  // Format the number
  return new Intl.NumberFormat("en-US", options).format(amount);
}
