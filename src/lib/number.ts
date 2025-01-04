export function formatNumberTo2DecimalPlace(value: number): string {
  // Check if the value has a fractional part
  const isWholeNumber = value === Math.trunc(value);

  // Return the number formatted based on its type
  return isWholeNumber ? value.toFixed(0) : value.toFixed(2);
}
