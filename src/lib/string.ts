import { UmojaLinnCurrency } from "@/types/project";

export function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) return input; // Handle empty string
  const firstLetter = input.charAt(0).toUpperCase();
  const restOfString = input.slice(1).toLowerCase();
  return firstLetter + restOfString;
}

export function getCurrencySymbol(currency?: UmojaLinnCurrency | null) {
  switch (currency) {
    case "EURO":
      return "€";
    case "NAIRA":
      return "₦";
    default:
      return currency;
  }
}
