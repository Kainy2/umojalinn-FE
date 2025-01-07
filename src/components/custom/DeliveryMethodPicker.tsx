import React, { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioGroupProps } from "@radix-ui/react-radio-group";
import { UmojaLinnDeliveryMethod } from "@/types/project";

const deliveryMethods: {
  label: string;
  value: UmojaLinnDeliveryMethod;
}[] = [
  {
    label: "Tracked",
    value: "TRACKED",
  },
  {
    label: "Not Tracked",
    value: "NON_TRACKED",
  },
  {
    label: "In person pickup",
    value: "IN_PERSON_PICKUP",
  },
];

const DeliveryMethodPicker = (props: RadioGroupProps) => {
  const id = useId();
  return (
    <RadioGroup {...props} className="flex justify-between my-6">
      {deliveryMethods.map((method) => {
        const radioId = `delivery-method-${method.value}-${id}`;
        return (
          <div key={method.value} className="flex items-center space-x-2">
            <RadioGroupItem id={radioId} value={method.value} />
            <Label htmlFor={radioId}>{method.label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default DeliveryMethodPicker;
