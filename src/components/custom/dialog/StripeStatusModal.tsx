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
import { useConnectStripeAccount } from "@/tanstack/hooks/useProject";

interface StripeStatusModalProps {
    currency: UmojaLinnCurrency;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const StripeStatusModal = ({
    currency,
    open,
    onOpenChange,
}: StripeStatusModalProps) => {


    const { mutate, isPending } = useConnectStripeAccount({
        onSuccess: (data) => {
            if (data.data.data.onboardingUrl) {
                window.open(data.data.data.onboardingUrl, "_blank");
            }
        }
    });




    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-start gap-4">
                    <div className="rounded-lg border border-gray-200 p-3 h-12 w-12 flex items-center justify-center">
                        <Landmark className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-[18px] font-semibold">
                            {currency} payout setup incomplete
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            You can accept {currency} projects, but funds will be held securely
                            until you add a {currency}-receiving account
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-start w-full mt-4">
                    <Button
                        type="button"
                        className="w-full bg-[#EAAA08] text-white font-semibold text-[18px]"
                        onClick={() => mutate()}
                        disabled={isPending}
                    >
                        {/* <Image src='/stripe.png' width={100} height={100} alt='stripe' /> */}
                        {isPending ? "Redirecting..." : "Continue Stripe Setup"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
