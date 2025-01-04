"use client";
import Alert from "@/components/custom/Alert";
import MilestoneCard, {
  MileStoneCardFooter,
} from "@/components/custom/card/Milestone";
import DeliveryMethodPicker from "@/components/custom/DeliveryMethodPicker";
import TotalPriceError from "@/components/custom/dialog/TotalPriceError";
import TextAreaField from "@/components/custom/TextField copy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getCurrencySymbol } from "@/lib/string";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useGetDesignerBidById,
  useSubmitBid,
  useUpdateBid,
  useUpdateMilestone,
} from "@/tanstack/hooks/useBid";
// import { useGetMe } from "@/tanstack/hooks/useUser";
import { UmojaLinnDeliveryMethod } from "@/types/project";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const MILESTONE_TEMPLATE = {
  title: "",
  description: "",
  price: 0,
};

const BidPage = () => {
  const { id } = useParams<{ id: string }>();
  const [milestones, setMilestones] = useState<
    {
      id?: string;
      title: string;
      description: string;
      price: number;
    }[]
  >([MILESTONE_TEMPLATE]);
  const [editing, setEditing] = useState<number | null>(0);
  const [deliveryMilestonePrice, setDeliveryMilestonePrice] = useState(0);
  const [deliveryMethod, setDeliveryMethod] =
    useState<UmojaLinnDeliveryMethod | null>(null);

  // const { data: meData } = useGetMe();

  const { data, isPending } = useGetDesignerBidById(id);
  const bid = data?.data?.data;
  const project = bid?.project;

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (bid?.milestones?.length) {
      setMilestones(
        bid.milestones.map((milestone) => ({
          title: milestone?.title,
          description: milestone?.description,
          price: milestone?.amount || 0,
          id: milestone?.id,
        }))
      );
      setEditing(null);
    }
    if (bid?.deliveryMilestone?.deliveryMethod) {
      setDeliveryMethod(bid.deliveryMilestone.deliveryMethod);
    }
    if (bid?.deliveryMilestone?.amount) {
      setDeliveryMilestonePrice(bid?.deliveryMilestone?.amount);
    }
    if (bid?.additionalNotesToClient) {
      setNote(bid?.additionalNotesToClient);
      setAddNote(true);
    }
  }, [bid]);

  const { mutate: createMilestone } = useCreateMilestone(id, {
    onSuccess: () => {
      setEditing(null);
    },
  });

  const { mutate: updateMilestone } = useUpdateMilestone({
    onSuccess: () => {
      setEditing(null);
    },
  });

  const { mutate: deleteMilestone } = useDeleteMilestone({
    onSuccess: () => {
      setMilestones((milestones) =>
        milestones?.length === 1 ? [] : milestones
      );
      setEditing(null);
    },
  });

  const { mutate: updateBid } = useUpdateBid(id, {
    onSuccess() {
      toast({
        title: "Bid saved in Drafts",
        description: "Your bid has been saved successfully.",
      });
      router.push(`/jobs/${project?.id}`);
    },
  });

  // Called after last update
  const { mutate: submitBid } = useSubmitBid(id, {
    onSuccess() {
      toast({
        title: "Bid Live",
        description: "Your bid has been published successfully.",
      });
      router.push(`/jobs/${project?.id}`);
    },
  });

  // Update before sending live
  const { mutate: updateToSubmit } = useUpdateBid(id, {
    onSuccess() {
      submitBid();
    },
  });

  const handleSave =
    (index: number) =>
    (props: { title: string; description: string; price: number }) => {
      const id = milestones[index]?.id;
      const { price: amount, ...otherProps } = props;
      const variables = {
        ...otherProps,
        amount,
      };
      if (id) {
        updateMilestone(variables);
      } else {
        createMilestone(variables);
      }
    };

  const [addNote, setAddNote] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const [excess, setExcess] = useState<number>(0);
  const [showExcessDialog, setShowExcessDialog] = useState<boolean>(false);

  const [mode, setMode] = useState<"UPDATE" | "LIVE" | null>(null);

  const handleUpdateAction = (mode: "UPDATE" | "LIVE" | null) => {
    switch (mode) {
      case "UPDATE":
        updateBid({
          additionalNote: addNote ? note : undefined,
          deliveryAmount: deliveryMilestonePrice,
          deliveryMethod: deliveryMethod || undefined,
        });
        break;
      case "LIVE":
        updateToSubmit({
          additionalNote: addNote ? note : undefined,
          deliveryAmount: deliveryMilestonePrice,
          deliveryMethod: deliveryMethod || undefined,
        });
        break;
      default:
        break;
    }
  };

  const handleUpdate = (mode: "UPDATE" | "LIVE" | null) => {
    if (
      typeof bid?.project?.budget === "number" &&
      bid?.project?.budget &&
      totalPrice > bid?.project?.budget
    ) {
      setExcess(totalPrice - bid?.project?.budget);
      setShowExcessDialog(true);
      setMode(mode);
    } else {
      handleUpdateAction(mode);
    }
  };

  const handleToggle = (index: number) => () =>
    setEditing((prev) => (prev === index ? null : index));

  const handleAdd = () => {
    setMilestones((prev) => {
      setEditing(prev.length);
      return [...prev, MILESTONE_TEMPLATE];
    });
  };

  const totalPrice = useMemo(
    () =>
      milestones?.reduce((prev, curr) => prev + (curr?.price || 0), 0) +
      deliveryMilestonePrice,
    [deliveryMilestonePrice, milestones]
  );

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton key={i} className="h-44 bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!bid) {
    return (
      <p className="h-60 flex items-center justify-center text-gray-400">
        No bid available
      </p>
    );
  }

  // if (bid?.designerId !== meData?.data?.data?.designerProfile?.id) {
  //   return (
  //     <p className="h-60 flex items-center justify-center text-gray-400">
  //       No edit access
  //     </p>
  //   );
  // }

  return (
    <div className="flex flex-col gap-8">
      {bid?.rejectionReason && (
        <Alert
          type="error"
          title="Client's note"
          message={bid?.rejectionReason}
        />
      )}
      {milestones.map((milestone, index) => (
        <MilestoneCard
          hideActions={!!editing && index !== editing}
          onDelete={() => deleteMilestone(milestone?.id || "")}
          onCancel={handleToggle(index)}
          onSave={handleSave(index)}
          key={index}
          view={index !== editing}
          {...milestone}
          onEdit={handleToggle(index)}
          currency={project?.currency || null}
        />
      ))}
      <div className="card p-8">
        <div className="text-gray-400">
          <h3 className="mb-2 font-semibold  text-subtitle-1">
            Delivery Milestone
          </h3>
          <h3 className="mb-2 font-semibold">
            {project?.deliveryAddress?.state},{" "}
            {project?.deliveryAddress?.country}
          </h3>
          <p className="text-sm mb-4">
            The complete location information of the client will be made
            available at the commencement of the project.
          </p>
        </div>
        <DeliveryMethodPicker
          disabled={
            !!editing || !["DRAFT", "REJECTED"].includes(bid?.status || "")
          }
          value={deliveryMethod || ""}
          onValueChange={(value: UmojaLinnDeliveryMethod) =>
            setDeliveryMethod(value)
          }
        />
        <MileStoneCardFooter
          view={!!editing || !["DRAFT", "REJECTED"].includes(bid?.status || "")}
          currency={project?.currency || null}
          label="Milestone Payment"
          price={deliveryMilestonePrice}
          onPriceChange={setDeliveryMilestonePrice}
        />
      </div>
      {["DRAFT", "REJECTED"].includes(bid?.status || "") && !editing && (
        <button
          className="text-left w-fit flex text-sm text-primary  [&>svg]:size-5 gap-2"
          onClick={handleAdd}
        >
          <Plus />
          Add another milestone
        </button>
      )}
      <div className="font-semibold">
        <div className="bg-slate-200/30 text-sm p-4 flex flex-col gap-4">
          <p className="flex justify-between ">
            <span className="text-foreground-body">Total Price</span>
            <span>
              {getCurrencySymbol(project?.currency)}
              {totalPrice}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground-body">Commission fee</span>
            <span>
              -{getCurrencySymbol(project?.currency)}
              {totalPrice * 0.1}
            </span>
          </p>
        </div>
        <p className="flex justify-between p-4 py-2 bg-gray-200">
          {" "}
          <span className="text-foreground-body">You recieve</span>
          <span>
            {getCurrencySymbol(project?.currency)}
            {totalPrice * 0.9}
          </span>
        </p>
      </div>
      <p className="text-subtitle-2 font-semibold text-right">
        <span className="text-foreground-body">Total Price</span>
        {"  "}
        <span>
          {getCurrencySymbol(project?.currency)}
          {totalPrice}
        </span>
      </p>
      <Separator className="bg-gray-200 h-px" orientation="horizontal" />
      {["DRAFT", "REJECTED"].includes(bid?.status || "") && addNote && (
        <div className="card p-8">
          <TextAreaField
            label="Additional note to client"
            placeholder="Enter a description..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex gap-1 items-center">
          <Switch
            id="add-note-switch"
            checked={addNote}
            onCheckedChange={() => setAddNote((prev) => !prev)}
          />{" "}
          <Label htmlFor="add-note-switch">Add note</Label>
        </div>
        {["DRAFT", "REJECTED"].includes(bid?.status || "") && (
          <div className="flex gap-4">
            {bid?.status === "DRAFT" && (
              <Button variant="outline" onClick={() => handleUpdate("UPDATE")}>
                Save & Exit
              </Button>
            )}
            <Button variant="default" onClick={() => handleUpdate("LIVE")}>
              Submit
            </Button>
          </div>
        )}
        <TotalPriceError
          open={showExcessDialog}
          onOpenChange={setShowExcessDialog}
          excess={excess}
          currency={bid.project?.currency}
          onConfirm={() => {
            handleUpdate(mode);
          }}
        />
      </div>
    </div>
  );
};

export default BidPage;
