"use client";

import { useCallback, useState } from "react";
import { UmojaLinnPayment } from "@/types/project";

const CHECKOUT_WINDOW_FEATURES = "noopener,noreferrer";

function openCheckout(url: string) {
  window.open(url, "_blank", CHECKOUT_WINDOW_FEATURES);
}

/**
 * Handles fund-mutation success: shows fees modal when fees are present,
 * otherwise opens Stripe checkout immediately.
 */
export function useFundingFeesCheckout() {
  const [payment, setPayment] = useState<UmojaLinnPayment | null>(null);
  const [open, setOpen] = useState(false);

  const handleFundSuccess = useCallback((data: UmojaLinnPayment | undefined) => {
    if (!data?.checkoutUrl) return;

    if (data.fees) {
      setPayment(data);
      setOpen(true);
      return;
    }

    openCheckout(data.checkoutUrl);
  }, []);

  const handleProceed = useCallback(() => {
    if (payment?.checkoutUrl) {
      openCheckout(payment.checkoutUrl);
    }
    setOpen(false);
    setPayment(null);
  }, [payment]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPayment(null);
    }
  }, []);

  return {
    feesDialogOpen: open,
    setFeesDialogOpen: handleOpenChange,
    payment,
    handleFundSuccess,
    handleProceedToCheckout: handleProceed,
  };
}
