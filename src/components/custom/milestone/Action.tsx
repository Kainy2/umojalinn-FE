import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  MilestoneStatus,
  MilestoneTimelineItem,
  MilestoneTimelineProps,
} from "./Timeline";

const MilestoneAction: React.FC<
  MilestoneTimelineItem & Pick<MilestoneTimelineProps, "isBuyer" | "isDesigner">
> = ({ isCurrent, isBuyer, status }) => {
  if (status === MilestoneStatus.IN_REVIEW && isCurrent && isBuyer)
    return (
      <>
        <Separator className="my-3" />
        <div className="flex gap-4 flex-col md:flex-row">
          <Button variant="outline" fullWidth>
            Reject
          </Button>
          <Button variant="success" fullWidth>
            Submit
          </Button>
        </div>
      </>
    );
};

export default MilestoneAction;
