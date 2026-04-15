import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UmojaLinnCurrency } from "@/types/project";
import { CircleHelp } from "lucide-react";
import { useConnectStripeAccount } from "@/tanstack/hooks/useProject";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface IStripeStatusModalProps {
    currency: UmojaLinnCurrency;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentAccountConnected?: boolean;
    paymentAccountOnboarded?: boolean;
    onProceed?: () => void;
}

export const StripeStatusModal = ({
    currency,
    open,
    onOpenChange,
    paymentAccountConnected,
    paymentAccountOnboarded,
    onProceed,
}: IStripeStatusModalProps) => {

    const [checked, setChecked] = React.useState(false);

    useEffect(() => {
        if (!open) {
            setChecked(false);
        }
    }, [open]);

    const { mutate, isPending } = useConnectStripeAccount({
        onSuccess: (data) => {
            if (data.data.data.onboardingUrl) {
                window.location.href = data.data.data.onboardingUrl;
            }
        }
    });

    const isNaira = currency === "NAIRA";

    const getCurrencyDisplay = (curr: UmojaLinnCurrency) => {
        switch (curr) {
            case "EURO":
                return "EUR";
            case "NAIRA":
                return "NGN";
            default:
                return curr;
        }
    };

    const displayCurrency = getCurrencyDisplay(currency);

    let title = `${displayCurrency} payout setup incomplete`;
    let description = `You can accept ${displayCurrency} projects, but funds will be held securely until you add a ${displayCurrency}-receiving account. Umoja linn does not convert currencies.`;
    let buttonText = "Create Bid (Set up Payout later in wallet)";

    if (!isNaira && (paymentAccountConnected === false && paymentAccountOnboarded === false)) {
        title = `Connect Stripe to accept ${displayCurrency} projects`;
        description = `To receive ${displayCurrency} payments, you must connect a Stripe account`;
        buttonText = "Connect Stripe";
    }

    const isConnectStripe = !isNaira && (paymentAccountConnected === false && paymentAccountOnboarded === false);

    const checkboxLabel = isConnectStripe
        ? `I understand ${displayCurrency} payouts require an international ${displayCurrency} account - funds will be held until I complete my ${displayCurrency} payout setup.`
        : `I understand I cannot withdraw ${displayCurrency} until payout setup is complete.`;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[544px]">
                <DialogHeader className="flex flex-col items-start gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="icon-wrapper error mb-4">
                                <CircleHelp />
                            </div>

                            <div>

                                <DialogTitle className="text-[18px] font-semibold text-[#181D27]">
                                    {title}
                                </DialogTitle>

                                {description && (
                                    <DialogDescription className="text-left text-[#535862]">
                                        {description}
                                    </DialogDescription>
                                )}
                            </div>

                        </div>
                    </div>
                </DialogHeader>
                <div className="flex items-start space-x-3 mt-6 ">
                    <Checkbox
                        id="acknowledge"
                        checked={checked}
                        onCheckedChange={(val) => setChecked(!!val)}
                        className="mt-0.5 border-[#D0D5DD] data-[state=checked]:border-[#EAAA08] data-[state=checked]:bg-white data-[state=checked]:text-[#EAAA08]"
                    />
                    <Label
                        htmlFor="acknowledge"
                        className="text-sm font-medium leading-relaxed text-[#535862] cursor-pointer"
                    >
                        {checkboxLabel}
                    </Label>
                </div>
                <DialogFooter className="sm:justify-start w-full mt-4">
                    <Button
                        type="button"
                        className="w-full bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-semibold text-[18px] h-[60px]"
                        onClick={() => {
                            if (isConnectStripe) {
                                mutate();
                            } else {
                                onProceed?.();
                            }
                        }}
                        disabled={isPending || !checked}
                    >
                        {isPending ? "Redirecting..." : buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
