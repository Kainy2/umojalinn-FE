import React from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { cn, numberToCommaString } from "@/lib/utils";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import {
  UmojaLinnCurrency,
  UmojaLinnDeliveryMethod,
  VariableDeliveryMileStoneSubmissions,
} from "@/types/project";
import { AddSubtractInput } from "../input/AddSubtractInput";
import { VariableDeliverySlider } from "./VariableDeliverySlider";
import { VariableDecisionDetailsSlider } from "./VariableDecisionDetailsSlider";
import { EmptyDeliveryDetails } from "./DeliveryDetails";
import { useGetMilestoneSubmissions } from "@/tanstack/hooks/useProject";

const DELIVERY_METHODS: { label: string; value: UmojaLinnDeliveryMethod }[] = [
  { label: "In person pickup", value: "IN_PERSON_PICKUP" },
  { label: "Tracked", value: "TRACKED" },
  { label: "Non tracked", value: "NON_TRACKED" },
];

type VariableDeliveryFormProps = {
  isAwaitingFunding: boolean
  milestoneId: string;
  isVariableDelivery: boolean;
  isDesigner: boolean;
  isDeliveryMilestone: boolean;
  currency: UmojaLinnCurrency;
  isCurrentMilestone: boolean;
  variableSubmissions?: VariableDeliveryMileStoneSubmissions[];
  editedVariablePrice: number;
  setEditedVariablePrice: (value: number) => void;
  selectedVariableDeliveryMethod: UmojaLinnDeliveryMethod;
  setSelectedVariableDeliveryMethod: (value: UmojaLinnDeliveryMethod) => void;
};

export const VariableDeliveryForm = ({
  isAwaitingFunding,
  milestoneId,
  isVariableDelivery,
  isDesigner,
  isDeliveryMilestone,
  currency = "NAIRA",
  isCurrentMilestone,
  variableSubmissions,
  editedVariablePrice,
  setEditedVariablePrice,
  selectedVariableDeliveryMethod,
  setSelectedVariableDeliveryMethod,
}: VariableDeliveryFormProps) => {
  const { data: milestoneSubmissionsData, isLoading: isLoadingSubmissions } =
  useGetMilestoneSubmissions(milestoneId);
  
  const milestoneSubmissions = milestoneSubmissionsData?.data?.data;
  
  if (!isVariableDelivery || isLoadingSubmissions) return null;
  // --- Core state ---
  const firstSubmission = variableSubmissions?.[0];
  const hasSubmission = !!firstSubmission && firstSubmission.status !== "REJECTED";
  const currentSubmission = hasSubmission ? firstSubmission : undefined;
  const hasFinalisedVariableSubmission = firstSubmission?.status === 'APPROVED'

	// --- Derived state ---
  const isEditable = isDesigner && isCurrentMilestone && !hasSubmission && !isAwaitingFunding
  const isDisabled = isDeliveryMilestone && !isCurrentMilestone;
  const isExpectingResponse = !isDesigner && isCurrentMilestone && isDeliveryMilestone && !hasSubmission;
  const isDecisionStage = !isDesigner && isCurrentMilestone && isDeliveryMilestone && hasSubmission

  const deliveryMethodText = capitalizeFirstLetter(
    currentSubmission?.deliveryMethod ?? selectedVariableDeliveryMethod
  ).replaceAll("_", " ");


  // --- Render ---
  return (
    <div className="space-y-4">
      {isDeliveryMilestone && (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          {/* Delivery Method Selector */}
          <div className="flex gap-2 items-center">
            <p className={!isCurrentMilestone ? "text-gray-400" : ""}>Delivery method</p>

            {isEditable ? (
              <Popover>
                <PopoverTrigger tabIndex={-1} asChild>
                  <div className="flex gap-2 text-xs py-1 px-2 min-w-32 border rounded-sm justify-between items-center cursor-pointer">
                    <span>{deliveryMethodText}</span>
                    <ChevronDown size={12} />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-52 flex flex-col rounded-lg p-0">
                  {DELIVERY_METHODS.map((method) => (
                    <PopoverClose key={method.value} className="focus:outline-none">
                      <button
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm p-4 text-sm capitalize text-left",
                          selectedVariableDeliveryMethod === method.value && "bg-gray-100"
                        )}
                        onClick={() => setSelectedVariableDeliveryMethod(method.value)}
                      >
                        {method.label}
                      </button>
                    </PopoverClose>
                  ))}
                </PopoverContent>
              </Popover>
            ) : (
              <span
                className={cn(
                  "text-xs py-1 px-2 border rounded-sm",
                  !isCurrentMilestone || currentSubmission ? "text-gray-400 border-gray-200" : ""
                )}
              >
                {deliveryMethodText}
              </span>
            )}
          </div>

          {/* Price Display */}
          {isEditable ? (
            <AddSubtractInput
              amount={editedVariablePrice}
              currency={currency}
              onAmountChange={setEditedVariablePrice}
            />
          ) : (
            currentSubmission && (
              <div className="font-medium">
                {getCurrencySymbol(currency)}
                {numberToCommaString(currentSubmission.amount)}
              </div>
            )
          )}
        </div>
      )}

      {/* Pending Designer Response */}
      {currentSubmission?.status === "PENDING" && !isEditable && isDesigner && !hasFinalisedVariableSubmission && (
        <div className="py-2.5 px-5 md:py-5 rounded-md border border-gray-300 bg-gray-50 text-gray-500">
          <EmptyDeliveryDetails
            currentDeliveryMethod={currentSubmission?.deliveryMethod ?? "IN_PERSON_PICKUP"}
          />
        </div>
      )}

      {/* Info Box */}
      {(isDisabled || isExpectingResponse) && !hasFinalisedVariableSubmission && (
        <div
          className={cn(
            "my-2 p-4 rounded-md border flex flex-col gap-1 text-sm transition-all",
            isExpectingResponse
              ? "text-gray-600 border-gray-400"
              : "text-gray-400 border-gray-300"
          )}
        >
          <h6 className="font-semibold">Variable delivery</h6>
          <p>
            {isDesigner
              ? "Variable Delivery means you can make adjustments to the delivery price and method at a later stage once you have the final delivery price and method. You will need to submit the final delivery price and method to your client for review and approval."
              : "Variable Delivery means adjustments will be made to the delivery price and method at a later stage. You will need to approve the final delivery price and method once the designer submits it for your review"
            }
          </p>
        </div>
      )}

      {/* Editable Slider */}
      {isEditable && !milestoneSubmissions?.length && (
        <VariableDeliverySlider
          selectedDeliveryMethod={selectedVariableDeliveryMethod}
          hasFinalisedVariableSubmission={hasFinalisedVariableSubmission} 
        />
      )}

      {/* Decision Stage */}
      {isDecisionStage && currentSubmission && !milestoneSubmissions?.length && (
        <VariableDecisionDetailsSlider
          currency={currency}
          deliveryMethod={currentSubmission.deliveryMethod}
          price={currentSubmission.amount}
          hasFinalisedVariableSubmission={hasFinalisedVariableSubmission}
        />
      )}
    </div>
  );
};
