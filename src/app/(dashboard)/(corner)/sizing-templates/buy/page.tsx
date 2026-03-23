"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePurchaseSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";
import { useGetAppConfig } from "@/tanstack/hooks/useUser";

const BuyTemplatesPage = () => {
    const router = useRouter();
    const { data: appConfig } = useGetAppConfig();
    const [selectedCurrency, setSelectedCurrency] = useState("euro");
    const [templateCount, setTemplateCount] = useState("1");

    const BASE_PRICE_EUR = appConfig?.data?.data?.defaultTemplatePriceInEuro || 5.99;


    const pricePerTemplateInEuro = BASE_PRICE_EUR;
    const totalAmount = (parseInt(templateCount) * pricePerTemplateInEuro).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const { mutate: purchaseTemplate, isPending } = usePurchaseSizingTemplate({
        onSuccess: (response) => {
            const checkoutUrl = response?.data?.data?.checkoutUrl;
            if (checkoutUrl) {
                window.open(checkoutUrl, "_blank");
            }
        },
    });

    const handlePayNow = () => {
        purchaseTemplate({
            currency: selectedCurrency.toUpperCase() as "EURO" | "NAIRA",
            numberOfTemplates: parseInt(templateCount, 10),
        });
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-[24px] font-bold text-foreground">Buy Templates</h1>
                <p className="text-sm text-gray-500 mt-1">Buy new sizing templates</p>
            </div>

            <Separator className="bg-gray-100" />

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* Left Column: Payment Options */}
                <div className="w-full lg:w-[60%]">
                    <h2 className="text-sm font-semibold text-foreground mb-4">
                        Select currency to pay with
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6">


                        <div className="md:w-full">
                            <RadioGroup
                                value={selectedCurrency}
                                onValueChange={setSelectedCurrency}
                                className="flex flex-col gap-4"
                            >
                                {/* Euro Option */}
                                <div
                                    className={`flex items-start justify-between p-4 border transition-all ${selectedCurrency === "euro"
                                        ? "border-[#EAB308] bg-[#FFFDF0]"
                                        : "border-gray-200 bg-white"
                                        }`}
                                    onClick={() => setSelectedCurrency("euro")}
                                >
                                    <div className="flex items-center justify-between w-full cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 relative flex-shrink-0 bg-gray-50 flex items-center justify-center border border-gray-200">
                                                <span className="text-foreground font-bold text-sm">€</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Pay with Euro</p>
                                            </div>
                                        </div>
                                        <RadioGroupItem value="euro" id="euro" className={selectedCurrency === "euro" ? "mt-1 text-[#EAB308] border-[#EAB308]" : "mt-1"} />
                                    </div>
                                </div>

                                {/* Naira Option */}
                                <div
                                    className={`flex items-start justify-between p-4 border transition-all ${selectedCurrency === "naira"
                                        ? "border-[#EAB308] bg-[#FFFDF0]"
                                        : "border-gray-200 bg-white"
                                        }`}
                                    onClick={() => setSelectedCurrency("naira")}
                                >
                                    <div className="flex items-center justify-between w-full cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 relative flex-shrink-0 bg-gray-50  flex items-center justify-center border border-gray-200">
                                                <span className="text-foreground font-bold text-sm">₦</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Pay with Naira</p>
                                            </div>
                                        </div>
                                        <RadioGroupItem value="naira" id="naira" className={selectedCurrency === "naira" ? "mt-1 text-[#EAB308] border-[#EAB308]" : "mt-1"} />
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-[40%]">
                    <div className="bg-gray-50 py-6 px-[18px] rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <div>
                            <label className="text-xs text-gray-600 block mb-2 font-medium">
                                Number of Templates to Buy
                            </label>
                            <Select value={templateCount} onValueChange={setTemplateCount}>
                                <SelectTrigger className="w-full bg-white h-10 border-gray-200">
                                    <SelectValue placeholder="Select amount" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-center">
                            <span className="text-gray-400 font-bold tracking-widest text-lg">---</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Total to Pay</span>
                            <span className="text-sm font-bold text-foreground">€{totalAmount}</span>
                        </div>

                        <Button
                            className="w-full bg-[#EAAA08] text-white font-semibold py-2.5 px-4 mt-2"
                            onClick={handlePayNow}
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : "Pay Now"}
                        </Button>
                    </div>
                </div>
            </div>

            <Separator className="bg-gray-100 mt-12 mb-6" />

            {/* Footer Back Button */}
            <div>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-foreground-body hover:bg-gray-100 px-0 hover:px-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
            </div>
        </div>
    );
};

export default BuyTemplatesPage;
