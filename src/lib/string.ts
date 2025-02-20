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

export function replaceSubsection(
  str: string,
  subsection: string,
  replacement?: string
): string {
  // Create a case-insensitive regular expression for the subsection
  const regex = new RegExp(subsection, "i");

  // Check if the subsection exists in the main string (case-insensitively)
  if (regex.test(str)) {
    return str.replace(regex, replacement || ""); // Remove the first occurrence of the subsection
  }
  return str?.trim(); // If the subsection is not found, return the original string
}
