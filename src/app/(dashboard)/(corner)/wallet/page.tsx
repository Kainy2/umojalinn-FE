"use client";
import WalletCard, {
  EscrowCard,
  CurrencyCard,
} from "@/components/custom/card/Wallet";
import { CurrencyCarousel } from "@/components/custom/card/CurrencyCarousel";
import { Separator } from "@/components/ui/separator";
import {
  useGetInfiniteTransactions,
  useGetWallet,
  useGetPaymentAccountInfo,
  useConnectStripeAccount,
} from "@/tanstack/hooks/useProject";
import { useGetWalletDisputeSummary } from "@/tanstack/hooks/useDispute";
import { useGetMe } from "@/tanstack/hooks/useUser";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { formatCurrencyValue } from "@/lib/number";
import WalletPageSkeleton from "@/components/custom/wallet/WalletPageSkeleton";
import { formatDate } from "date-fns";
import {
  getTransactionIcon,
  getTransactionStatus,
  getDefaultCurrencyFromCountry,
  getCurrencyCarouselOrder,
  paymentAccountHasStoredPayoutAddress,
  getAvailableWalletBalanceForCurrency,
} from "@/components/util/wallet";
import { cn } from "@/lib/utils";
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { UmojaLinnCurrency } from "@/types/project";
import LinkStripeAddressDialog from "@/components/custom/dialog/LinkStripeAddressDialog";
import ConnectPaymentAccountOtpDialog from "@/components/custom/dialog/ConnectPaymentAccountOtpDialog";
import WalletDisputesSection from "@/components/custom/wallet/WalletDisputesSection";
import TourReadyMarker from "@/components/tour/TourReadyMarker";
const WithdrawalPage = () => {
  const { data: userData } = useGetMe();
  const { data: session } = useSession();
  const { data: walletData, isPending: isWalletPending } = useGetWallet();
  const { data: disputeSummaryResponse } = useGetWalletDisputeSummary();
  const { data: paymentAccountData, isPending: isPaymentAccountPending } =
    useGetPaymentAccountInfo();

  const user = userData?.data?.data;
  const defaultCurrency = getDefaultCurrencyFromCountry(user?.address?.country);

  const [selectedCurrency, setSelectedCurrency] =
    useState<UmojaLinnCurrency>("EURO");
  const [hideBalance, setHideBalance] = useState(true);
  const [linkStripeAddressOpen, setLinkStripeAddressOpen] = useState(false);
  const [connectOtpDialogOpen, setConnectOtpDialogOpen] = useState(false);

  const { mutate: connectStripeAccount, isPending: isConnectingStripe } =
    useConnectStripeAccount({
      onSuccess: (data) => {
        setConnectOtpDialogOpen(false);
        const onboardingUrl = data?.data?.data?.onboardingUrl;
        if (onboardingUrl) {
          window.location.href = onboardingUrl;
        }
      },
    });

  const hasSetDefault = useRef(false);
  useEffect(() => {
    if (!hasSetDefault.current && user) {
      setSelectedCurrency(defaultCurrency);
      hasSetDefault.current = true;
    }
  }, [user, defaultCurrency]);

  const currencyOrder = getCurrencyCarouselOrder(defaultCurrency);

  const {
    data: allTransactions,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteTransactions();
  const transactions = useInfiniteData(allTransactions);

  const wallet = walletData?.data?.data;
  const paymentAccount = paymentAccountData?.data?.data?.[0];
  const disputeSummary = disputeSummaryResponse?.data?.data;
  const selectedCurrencyDisputeSummary = disputeSummary?.[selectedCurrency];

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  const openConnectStripeOtpDialog = () => {
    setConnectOtpDialogOpen(true);
  };

  const handleConnectStripeOtpConfirm = (otp: string) => {
    connectStripeAccount({ otp });
  };

  const handleLinkStripe = () => {
    if (!paymentAccountHasStoredPayoutAddress(paymentAccount)) {
      setLinkStripeAddressOpen(true);
      return;
    }
    const url = paymentAccount?.stripeOnboardingUrl;
    if (url) {
      window.location.href = url;
      return;
    }
    openConnectStripeOtpDialog();
  };

  const getActionLabel = (currency: UmojaLinnCurrency): string | null => {
    if (disputeSummary?.[currency]?.restricted) {
      return "Withdrawals restricted";
    }
    if (currency === "NAIRA") {
      return paymentAccount?.paystackStatus !== "ENABLED"
        ? "Action required"
        : null;
    }
    switch (paymentAccount?.stripeStatus) {
      case "NOT_CONNECTED":
        return "Not connected";
      case "ONBOARDING_STARTED":
        return "Setup incomplete";
      case "ACTION_REQUIRED":
        return "Action required";
      case "BANK_DETAILS_MISSING":
        return "Bank details missing";
      case "RESTRICTED":
        return "Action required";
      case "ENABLED":
        return null;
      default:
        return "Action required";
    }
  };

  const isPageLoading = isPaymentAccountPending || isWalletPending;

  if (isPageLoading) {
    return (
      <>
        <TourReadyMarker ready={false} />
        <WalletPageSkeleton showEscrow={isDesigner} />
      </>
    );
  }

  return (
    <>
      <TourReadyMarker ready />
      <LinkStripeAddressDialog
        open={linkStripeAddressOpen}
        onOpenChange={setLinkStripeAddressOpen}
        onAddressSaved={openConnectStripeOtpDialog}
      />

      <ConnectPaymentAccountOtpDialog
        open={connectOtpDialogOpen}
        onOpenChange={setConnectOtpDialogOpen}
        intent="stripe"
        onConfirm={handleConnectStripeOtpConfirm}
        isConfirming={isConnectingStripe}
      />

      <h1 className="text-subtitle-1 font-bold mb-8">Wallet</h1>
      <div className="flex h-full flex-col lg:flex-row gap-4">
        <div className="shrink-0 w-full lg:w-8/12">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-4">
              <WalletCard
                wallet={wallet}
                stripeStatus={paymentAccount?.stripeStatus}
                paystackStatus={paymentAccount?.paystackStatus}
                onLinkStripe={handleLinkStripe}
                isLinkingStripe={isConnectingStripe}
                hideBalance={hideBalance}
                onToggleBalance={() => setHideBalance((prev) => !prev)}
                currency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                currencyDisputeSummary={selectedCurrencyDisputeSummary}
              />
              <div id="tour-wallet-currency-carousel">
                <CurrencyCarousel>
                {currencyOrder.map((currency) => {
                  const lockedAmount = disputeSummary?.[currency]?.locked ?? 0;
                  const availableAmount = getAvailableWalletBalanceForCurrency(
                    wallet,
                    currency,
                    lockedAmount,
                  );
                  return (
                    <CurrencyCard
                      key={currency}
                      currency={currency}
                      amount={availableAmount}
                      hideBalance={hideBalance}
                      isSelected={selectedCurrency === currency}
                      stripeStatusLabel={getActionLabel(currency)}
                      disputeHeldAmount={lockedAmount}
                      onClick={() => setSelectedCurrency(currency)}
                    />
                  );
                })}
                </CurrencyCarousel>
              </div>
              <WalletDisputesSection
                currency={selectedCurrency}
                hideBalance={hideBalance}
              />
            </div>
            {isDesigner && <EscrowCard wallet={wallet!} />}
          </div>
        </div>
        <div
          id="tour-wallet-recent-transactions"
          className="flex-1 shrink-0  max-h-[80vh] overflow-y-scroll p-8 border border-border w-full lg:w-3/12"
        >
          <h2 className="font-semibold mb-2">Recent transactions</h2>
          <Separator className="bg-border/50" />
          {transactions?.map?.((trans) => {
            const isCredit =
              !!session?.user?.profileRole &&
              getTransactionStatus(
                trans?.transactionType,
                session?.user?.profileRole,
              );
            const transactionSign = isCredit ? "+" : "-";
            const getColorClass = () => {
              if (trans?.transactionType === "MILESTONE_COMPLETED") {
                return "text-success";
              } else if (trans?.transactionType === "WITHDRAWAL_REQUEST") {
                if (trans?.status === "SUCCESS") {
                  return "text-error";
                } else {
                  return "text-warning";
                }
              } else {
                return "text-warning";
              }
            };

            const getTrxStatusText = () => {
              switch (trans?.status) {
                case "FAILED":
                  return "rejected";
                case "PENDING":
                  return "submitted";
                case "SUCCESS":
                  return "approved";
                default:
                  return "submitted";
              }
            };

            return (
              <div
                className="flex items-center text-foreground-body gap-3 border-b border-border/50 py-2"
                key={trans?.id}
              >
                <div className="w-10 shrink-0">
                  {getTransactionIcon(trans)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {capitalizeFirstLetter(
                        trans?.transactionType?.replace(
                          /_|REQUEST|COMPLETED/g,
                          (match) =>
                            match === "_"
                              ? " "
                              : match === "REQUEST"
                                ? ""
                                : match === "COMPLETED"
                                  ? "approved "
                                  : match,
                        ),
                      )}
                      {trans?.transactionType === "WITHDRAWAL_REQUEST"
                        ? getTrxStatusText()
                        : ""}
                    </p>
                    <p className={getColorClass()}>
                      {`${
                        trans?.transactionType !== "WITHDRAWAL_REQUEST"
                          ? transactionSign
                          : ""
                      }                
                      ${getCurrencySymbol(
                        trans?.currency,
                      )}${formatCurrencyValue(trans?.amount)}`}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p
                      className={cn(
                        "text-sm text-foreground-body",
                        !trans.withdrawalMethod?.paypalEmail && "capitalize",
                      )}
                    >
                      {trans.withdrawalMethod?.paypalEmail ||
                        trans?.project?.title ||
                        trans?.paymentChannel.replace("_", " ").toLowerCase() ||
                        ""}
                    </p>
                    <p className="text-sm">
                      {formatDate(trans?.createdAt, "dd/MM/yy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {hasNextPage && (
            <button
              onClick={() => hasNextPage && fetchNextPage()}
              className="text-primary text-sm text-right block w-full mt-4 py-2 hover:text-primary/70 transition"
            >
              {isFetchingNextPage ? "loading more..." : "Show more"}
            </button>
          )}

          {!isPending && !transactions?.length && (
            <div className="flex items-center justify-center h-[30vh] text-gray-500 text-sm">
              <p>No transaction data</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawalPage;
