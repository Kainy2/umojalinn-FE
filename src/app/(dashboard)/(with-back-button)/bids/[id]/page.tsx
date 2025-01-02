import Alert from "@/components/custom/Alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MOCK_BIDS } from "@/data/bid";
import { getCurrencySymbol } from "@/lib/string";
import { PageProps } from "@/types/util";
import React from "react";

const deliveryMethods = [
  {
    label: "Tracked",
    value: "TRACKED",
  },
  {
    label: "Not Tracked",
    value: "NOT-TRACKED",
  },
  {
    label: "In person pickup",
    value: "IN-PERSON",
  },
];

const IndividualBidPage = async (props: PageProps<{ id: string }>) => {
  const { id } = await props.params;
  const bid = MOCK_BIDS.find((val) => val.id === id);
  return (
    <div className="flex flex-col gap-4">
      {/* budget Alert here */}
      <Alert
        title="Designer's note"
        message="Your budget is too much for this project, if you would do $700, i will be excited to work with you"
      />
      {bid?.milestones?.map((milestone, index) => (
        <div className="card" key={index}>
          <h3 className="mb-2 font-semibold">
            {index + 1} {milestone?.title}
          </h3>
          <p className="text-sm mb-4">{milestone?.description}</p>
          <div className="font-semibold flex justify-between">
            <p>Milestone payment</p>
            <p>
              {getCurrencySymbol(bid?.currency)}
              {milestone?.payment}
            </p>
          </div>
        </div>
      ))}
      <div className="card">
        <div className="text-gray-400">
          <h3 className="mb-2 font-semibold  text-subtitle-1">
            Delivery Milestone
          </h3>
          <h3 className="mb-2 font-semibold">Lagos, Nigeria</h3>
          <p className="text-sm mb-4">
            The complete location information of the client will be made
            available at the commencement of the project.
          </p>
        </div>
        <RadioGroup className="flex justify-between my-6">
          {deliveryMethods.map((method) => {
            const radioId = `delivery-method-${method.value}`;
            return (
              <div key={method.value} className="flex items-center space-x-2">
                <RadioGroupItem id={radioId} value={method.value} />
                <Label htmlFor={radioId}>{method.label}</Label>
              </div>
            );
          })}
        </RadioGroup>
        <div className="font-semibold flex justify-between">
          <p>Milestone payment</p>
          <p>
            {getCurrencySymbol(bid?.currency)} {bid?.budget}
          </p>
        </div>
      </div>
      <p className="text-subtitle-2 font-semibold text-foreground text-right mt-8">
        <span className="text-foreground-body">Buget</span>{" "}
        {getCurrencySymbol(bid?.currency)}
        {bid?.budget}
      </p>
      <Separator />
      <div className="flex gap-4 justify-end">
        <Button variant="outline" className="border-error text-error">
          Reject proposal
        </Button>
        <Button variant="success">Accept proposal</Button>
      </div>
    </div>
  );
};

export default IndividualBidPage;
