"use client";
import DialogListPickerItem from "@/components/custom/dialog/ListPickerItem";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import { Separator } from "@/components/ui/separator";
import ProjectEditFooter from "@/section/form/project/edit/Footer";
import { ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const OTHER_FUND_TYPES = ["DIRECT_TRANSFER"] as const;

type OtherFundType = (typeof OTHER_FUND_TYPES)[number];

const getButtonProps = (type: OtherFundType) => {
  switch (type) {
    case "DIRECT_TRANSFER":
    default:
      return {
        icon: <ArrowUpRight className="text-foreground" />,
        title: "Pay with direct transfer",
      };
  }
};

const getFundTypeUrl = (type: OtherFundType, pathname: string) => {
  switch (type) {
    case "DIRECT_TRANSFER":
    default:
      return `${pathname}/direct-transfer`;
  }
};

const FundPage = () => {
  const [fundType, setFundType] = useState<OtherFundType | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <h1 className="text-subtitle-1 font-semibold mb-1">
        Other funding Method
      </h1>
      <p className="mb-6 text-foreground-body">Available funding methods</p>
      <Separator className="my-3 border-t-1 border-gray-100" />
      <div>
        <FormItemWrapper
          title="Funding details"
          description="Select funding method."
          className="mb-20"
        >
          <div className="flex gap-4 flex-col">
            {OTHER_FUND_TYPES.map((type) => (
              <DialogListPickerItem
                {...getButtonProps(type)}
                key={type}
                onClick={() => setFundType(type)}
                active={fundType === type}
                rounded
                noIconWrapper
              />
            ))}
          </div>
        </FormItemWrapper>
      </div>

      <ProjectEditFooter
        handleSave={() =>
          fundType && router.push(getFundTypeUrl(fundType, pathname))
        }
        loading={!fundType}
        hideDraft
        saveText="Fund Escrow"
      />
    </>
  );
};

export default FundPage;
