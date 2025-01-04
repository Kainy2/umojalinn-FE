"use client";
import Alert from "@/components/custom/Alert";
import DeliveryMethodPicker from "@/components/custom/DeliveryMethodPicker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCurrencySymbol } from "@/lib/string";
import { useGetBidById } from "@/tanstack/hooks/useBid";

import { useParams } from "next/navigation";
import React from "react";

const IndividualBidPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetBidById(id);
  const bid = data?.data?.data;
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
              {getCurrencySymbol(bid?.project?.currency)}
              {milestone?.amount}
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
        <DeliveryMethodPicker />
        <div className="font-semibold flex justify-between">
          <p>Milestone payment</p>
          <p>
            {getCurrencySymbol(bid?.project?.currency)}{" "}
            {bid?.deliveryMilestone?.amount}
          </p>
        </div>
      </div>
      <p className="text-subtitle-2 font-semibold text-foreground text-right mt-8">
        <span className="text-foreground-body">Buget</span>{" "}
        {getCurrencySymbol(bid?.project?.currency)}
        {bid?.amount}
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
