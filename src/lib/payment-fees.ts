import { UmojaLinnCurrency } from "@/types/project";

/** Stripe collection-fee formula description for the given currency. */
export function getCollectionFeeFormula(
  currency?: UmojaLinnCurrency | null,
): string | null {
  switch (currency) {
    case "EURO":
      return "1.5% + €0.25";
    case "GBP":
      return "1.5% + £0.20";
    case "USD":
      return "2.9% + $0.30";
    case "CAD":
      return "2.9% + C$0.30";
    default:
      return null;
  }
}
