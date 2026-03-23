import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";
import { UmojaLinnCurrency } from "@/types/project";
import { useRouter } from "next/navigation";
import { useConnectStripeAccount } from "@/tanstack/hooks/useProject";

interface StripeStatusModalProps {
    currency: UmojaLinnCurrency;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentAccountConnected?: boolean;
    paymentAccountOnboarded?: boolean;
}

export const StripeStatusModal = ({
    currency,
    open,
    onOpenChange,
    paymentAccountConnected,
    paymentAccountOnboarded,
}: StripeStatusModalProps) => {
    const router = useRouter();

    const { mutate, isPending } = useConnectStripeAccount({
        onSuccess: (data) => {
            if (data.data.data.onboardingUrl) {
                window.location.href = data.data.data.onboardingUrl;
            }
        }
    });

    const isNaira = currency === "NAIRA";

    let title = `${currency} payout setup incomplete`;
    let description = `You can accept ${currency} projects, but funds will be held securely until you add a ${currency}-receiving account.`;
    let buttonText = isNaira ? "Add Account" : "Continue Stripe Setup";

    if (isNaira) {
        title = "Add a bank account to accept Naira projects";
        description = "To receive Naira payments, you must connect a bank account";
        buttonText = "Add Account";
    } else if (!paymentAccountConnected && !paymentAccountOnboarded) {
        title = `Connect Stripe to receive ${currency} projects`;
        description = `To receive ${currency} payments, you must connect a Stripe account`;
        buttonText = "Connect Stripe";
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-start gap-4">
                    <div className="rounded-lg border border-gray-200 p-3 h-12 w-12 flex items-center justify-center">
                        <Landmark className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-[18px] font-semibold">
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-left">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-start w-full mt-4">
                    <Button
                        type="button"
                        className="w-full bg-[#EAAA08] text-white font-semibold text-[18px]"
                        onClick={() => {
                            if (isNaira) {
                                router.push("/wallet/withdraw/naira");
                            } else {
                                mutate();
                            }
                        }}
                        disabled={isPending}
                    >
                        {isPending ? "Redirecting..." : buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
