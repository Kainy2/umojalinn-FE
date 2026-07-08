import type { TTourTargetId } from "@/constant/tour/@types";

export type TWalletTourTargetId = Extract<
  TTourTargetId,
  | "tour-sidebar-wallet"
  | "tour-wallet-link-account"
  | "tour-wallet-currency-carousel"
  | "tour-wallet-recent-transactions"
>;

const tourTarget = (id: TWalletTourTargetId) => `#${id}`;

const WALLET_TOUR_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const WALLET_TOUR = {
  tour: "wallet" as const,
  steps: [
    {
      ...WALLET_TOUR_POINTER,
      icon: null,
      title: "Welcome to Your Wallet",
      content:
        "View balances, manage payout methods, and withdraw your earnings securely - all in one place.",
      selector: tourTarget("tour-sidebar-wallet"),
      side: "right" as const,
      nextRoute: "/wallet",
    },
    {
      ...WALLET_TOUR_POINTER,
      icon: null,
      title: "Connect Your Payout Account",
      content:
        "Link your bank account through our secure payment provider to receive your earnings. Payouts can also be managed in Payments Settings.",
      selector: tourTarget("tour-wallet-link-account"),
      side: "left" as const,
      prevRoute: "/wallet",
      disableInteraction: true,
    },
    {
      ...WALLET_TOUR_POINTER,
      icon: null,
      title: "View Different Currencies",
      content:
        "Switch between supported currencies using the dropdown or by selecting one of the currency cards below.",
      selector: tourTarget("tour-wallet-currency-carousel"),
      side: "bottom" as const,
      prevRoute: "/wallet",
    },
    {
      ...WALLET_TOUR_POINTER,
      icon: null,
      title: "Track Every Payment",
      content:
        "View client milestone releases, withdrawals, refunds and deposits in one place.",
      selector: tourTarget("tour-wallet-recent-transactions"),
      side: "left" as const,
      prevRoute: "/wallet",
    },
  ],
};
