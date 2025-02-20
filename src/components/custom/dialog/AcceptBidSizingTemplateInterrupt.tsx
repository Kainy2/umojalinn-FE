import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import {
  DialogDescription,
  DialogProps,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { CircleHelp, Tag } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import DialogListPickerItem from "./ListPickerItem";

type ButtonOnClickProp = React.ComponentProps<"button">["onClick"];

const AcceptBidSizingTemplateInterrupt = (
  props: DialogProps & {
    onConfirm?: ButtonOnClickProp;
  }
) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex flex-col [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[40vw]">
        <DialogHeader className="flex gap-2 flex-col">
          <div className="icon-wrapper success mb-4">
            <CircleHelp />
          </div>
          <div>
            <DialogTitle className="font-semibold text-left">
              Sizing template required
            </DialogTitle>
            <DialogDescription className=" text-left">
              Sizing templates not selected, required to proceed
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={props?.onConfirm} fullWidth>
            Select sizing template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AcceptBidSizingTemplateInterruptConfirm = (
  props: DialogProps & {
    loading?: boolean;
    handleCreateNewSizingTemplate: ButtonOnClickProp;
    handleAddSizingTemplateToProject: (templateId: string) => void;
  }
) => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"SELECT" | "CONFIRM">("SELECT");

  const { data: liveSizingTemplates, isPending: loadingLivesizingTemplates } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: "LIVE",
    });

  const [sizingTemplateId, selectSizingTemplateId] = useState<null | string>(
    null
  );

  if (stage === "CONFIRM" && sizingTemplateId) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="flex flex-col [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[40vw]">
          <DialogHeader className="flex gap-2 flex-col">
            <div>
              <DialogTitle className="font-semibold text-left">
                Select Sizing template
              </DialogTitle>
              <DialogDescription className=" text-left">
                Please verify if selected template is correct
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex gap-2 items-center">
            <div className="icon-wrapper">
              <Tag />
            </div>
            <span>
              {
                liveSizingTemplates?.data?.data?.find(
                  (template) => template?.id === sizingTemplateId
                )?.name
              }
            </span>
          </div>
          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <Button
                disabled={props.loading}
                fullWidth
                variant="outline"
                onClick={() => setStage("SELECT")}
              >
                Change Sizing template
              </Button>
              <Button
                loading={props.loading}
                onClick={() => {
                  setOpen(false);
                  props.handleAddSizingTemplateToProject?.(sizingTemplateId);
                }}
                fullWidth
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex flex-col [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[40vw]">
        <DialogHeader className="flex gap-2 flex-col lg:flex-row">
          <div>
            <DialogTitle className="font-semibold text-left">
              Select Sizing template
            </DialogTitle>
            <DialogDescription className=" text-left">
              Please select a sizing template
            </DialogDescription>
          </div>
        </DialogHeader>
        {loadingLivesizingTemplates && <Skeleton className="h-12" />}
        {liveSizingTemplates?.data?.data?.length ? (
          liveSizingTemplates?.data?.data?.map?.((template) => {
            const active = template?.id === sizingTemplateId;
            return (
              <DialogListPickerItem
                onClick={() => selectSizingTemplateId(template?.id)}
                key={template?.id}
                icon={<Tag />}
                active={active}
                title={template?.name}
              />
            );
          })
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image
              src="/img/svg/no-sizing-template.svg"
              height={160}
              width={160}
              className="object-contain"
              alt=""
            />
            <span>No Sizing Template Available</span>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={(e) => {
              if (!liveSizingTemplates?.data?.data?.length) {
                props?.handleCreateNewSizingTemplate?.(e);
                props?.onOpenChange?.(false);
                setOpen(false);
              } else {
                setStage("CONFIRM");
              }
            }}
            fullWidth
            disabled={
              loadingLivesizingTemplates ||
              (!sizingTemplateId && !!liveSizingTemplates?.data?.data?.length)
            }
          >
            {liveSizingTemplates?.data?.data?.length ||
            loadingLivesizingTemplates
              ? "Confirm"
              : "Create New Sizing Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptBidSizingTemplateInterrupt;
