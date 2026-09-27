import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { IBuyExtraTemplateCardProps } from "./@types";

const BuyExtraTemplateCard = ({ onClick }: IBuyExtraTemplateCardProps) => {
    return (
        <div className="flex flex-col p-2 justify-around border-2 border-dotted border-gray-200 gap-2 rounded-[16px] w-full lg:w-[300px]">
            {/* Top Image Section */}
            <div className="relative h-44 w-full bg-[#f8f9fa] flex items-center justify-center rounded-[8px] overflow-hidden shrink-0">
                {/* Placeholder image from existing assets */}
                <Image
                    src="/img/png/buy-template.png"
                    alt="Buy Extra Measurement Template"
                    className="object-cover"
                    fill
                />
                {/* Price Pill */}
                <div className="absolute top-4 left-4 bg-[#FFFDF0] text-[#865C20] border border-[#FDE047] font-bold px-4 py-1.5 rounded-full text-sm shadow-sm z-10">
                    €5.99
                </div>
            </div>

            {/* Bottom Action Section */}
            <div className="p-2 bg-gray-200 flex items-center justify-between gap-3 rounded-[8px]">
                <p className="text-xs italic text-[#4B5563] font-medium leading-[1.2]">
                    Buy extra Measurement<br />Template slot
                </p>
                <Button
                    onClick={onClick}
                    className="bg-[#EAB308] text-white px-2 py-4 h-auto text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap"
                >
                    Buy template
                </Button>
            </div>
        </div>
    );
};

export default BuyExtraTemplateCard;
