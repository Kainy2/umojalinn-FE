import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { IWalletPageSkeletonProps } from "./@types";

const CURRENCY_CARD_COUNT = 3;
const TRANSACTION_ROW_COUNT = 4;
const ESCROW_LINE_COUNT = 5;

const CurrencyCardSkeleton = () => (
  <div className="p-6 border border-input rounded-lg w-[249px] bg-white flex flex-col gap-6 shadow-sm shrink-0">
    <div className="flex items-center justify-between">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-9 w-28" />
    </div>
  </div>
);

const TransactionRowSkeleton = () => (
  <div className="flex items-center gap-3 border-b border-border/50 py-2">
    <Skeleton className="size-10 shrink-0 rounded-md" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-12" />
      </div>
    </div>
  </div>
);

const WalletPageSkeleton = ({ showEscrow = false }: IWalletPageSkeletonProps) => {
  return (
    <>
      <Skeleton className="h-8 w-24 mb-8" />

      <div className="flex h-full flex-col lg:flex-row gap-4">
        <div className="shrink-0 w-full lg:w-8/12">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Main balance card */}
              <div className="px-2 py-4 lg:p-8 border border-input rounded-lg w-full bg-white">
                <div className="flex justify-between items-start lg:mb-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20 rounded-2xl" />
                  </div>
                  <Skeleton className="hidden lg:block h-10 w-28 rounded-md" />
                </div>

                <div className="flex items-center justify-between lg:justify-normal gap-4 lg:mb-8">
                  <Skeleton className="h-9 lg:h-12 w-48 lg:w-64" />
                  <Skeleton className="size-10 rounded-full shrink-0" />
                </div>

                <Skeleton className="h-10 w-56 max-w-full rounded-lg my-2" />
                <Skeleton className="lg:hidden h-10 w-full rounded-md" />
              </div>

              {/* Currency carousel */}
              <div className="flex gap-4 overflow-hidden pb-4">
                {Array.from({ length: CURRENCY_CARD_COUNT }).map((_, i) => (
                  <CurrencyCardSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Escrow breakdown (designers) */}
            {showEscrow && (
              <div className="p-6 border border-input rounded-lg w-full bg-white">
                <Skeleton className="h-5 w-36 mb-6" />
                <div className="flex flex-col gap-4 mb-8">
                  {Array.from({ length: ESCROW_LINE_COUNT }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-24" />
                  ))}
                </div>
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Recent transactions sidebar */}
        <div className="flex-1 shrink-0 max-h-[80vh] p-8 border border-border w-full lg:w-3/12">
          <Skeleton className="h-5 w-40 mb-2" />
          <Separator className="bg-border/50" />
          <div className="mt-2">
            {Array.from({ length: TRANSACTION_ROW_COUNT }).map((_, i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
          <Skeleton className="h-4 w-20 ml-auto mt-4" />
        </div>
      </div>
    </>
  );
};

export default WalletPageSkeleton;
