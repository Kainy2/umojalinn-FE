import { UmojaLinnCurrency, UmojalinnWalletTransaction } from "@/types/project";

import Paypal from "@/icons/Paypal";
import Bank from "@/icons/Bank";
import { UmojaLinnUserRole } from "@/types/user";

// Euro-zone / European countries (broad list; GBP countries handled separately)
const EUROPEAN_COUNTRIES = new Set([
  "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
  "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland",
  "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg",
  "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
  "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia",
  "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "Vatican City",
  // common alternate names
  "The Netherlands", "Czech Republic", "Czechia",
]);

/**
 * Returns the most relevant default currency for a given country name.
 * - Nigeria  → NAIRA
 * - Canada   → CAD
 * - UK       → GBP
 * - European → EURO
 * - US       → USD
 * - Fallback → EURO
 */
export const getDefaultCurrencyFromCountry = (
  country: string | null | undefined
): UmojaLinnCurrency => {
  if (!country) return "EURO";

  const normalised = country.trim().toLowerCase();

  if (normalised === "nigeria") return "NAIRA";
  if (normalised === "canada") return "CAD";
  if (
    normalised === "united kingdom" ||
    normalised === "uk" ||
    normalised === "great britain"
  ) return "GBP";
  if (normalised === "united states" || normalised === "usa" || normalised === "us") return "USD";
  if (EUROPEAN_COUNTRIES.has(country.trim())) return "EURO";

  return "EURO"; // fallback
};


/**
 * Returns a sorted currency order with the default currency first.
 */
export const getCurrencyCarouselOrder = (
  defaultCurrency: UmojaLinnCurrency
): UmojaLinnCurrency[] => {
  const all: UmojaLinnCurrency[] = ["NAIRA", "EURO", "USD", "GBP", "CAD"];
  return [defaultCurrency, ...all.filter((c) => c !== defaultCurrency)];
};

export const getTransactionIcon = (
  channel: UmojalinnWalletTransaction["paymentChannel"]
) => {
  switch (channel) {
    case "PAYPAL":
      return <Paypal />;
    case "DIRECT_TRANSFER":
    default:
      return <Bank />;
  }
};


export const getTransactionStatus = (
  type: UmojalinnWalletTransaction["transactionType"],
  profileRole: UmojaLinnUserRole
) => {
  let creditList: UmojalinnWalletTransaction["transactionType"][] = [
    "FUND_ESCROW",
    "WALLET_TO_UP",
  ];

  if (profileRole === "DESIGNER") {
    creditList = [...creditList, "MILESTONE_COMPLETED"];
  }

  return creditList?.includes(type);
};