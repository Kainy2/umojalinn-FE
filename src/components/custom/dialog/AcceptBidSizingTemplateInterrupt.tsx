import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import {
  DialogDescription,
  DialogProps,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { CircleHelp, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DialogListPickerItem from "./ListPickerItem";
// import { cn } from "@/lib/utils";
import {
  filterTemplatesForProject,
  getNoMatchingSizingTemplateMessage,
} from "@/lib/sizing-template-utils";
import { UmojaLinnSizingTemplate } from "@/types/project";

type ButtonOnClickProp = React.ComponentProps<"button">["onClick"];

const FREE_TEMPLATE_LIMIT = 3;

const AcceptBidSizingTemplateInterrupt = (
  props: DialogProps & {
    onConfirm?: ButtonOnClickProp;
    pendingConfirm: boolean;
  },
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
          <Button
            onClick={props?.onConfirm}
            loading={props.pendingConfirm}
            fullWidth
          >
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
    loadingCreate: boolean;
    handleCreateNewSizingTemplate: ButtonOnClickProp;
    handleAddSizingTemplateToProject: (templateId: string) => void;
    projectGender?: UmojaLinnSizingTemplate["gender"] | null;
  },
) => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"SELECT" | "CONFIRM">("SELECT");

  const { data: liveSizingTemplates, isPending: loadingLivesizingTemplates } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: ["LIVE", "DRAFT"],
    });
  const { data: me } = useGetMe();
  const router = useRouter();

  // Get total template count to check limit
  const { data: allTemplatesData } = useGetAllSizingTemplates();
  const totalTemplateCount = allTemplatesData?.data?.data?.length ?? 0;
  const maxTemplates =
    me?.data?.data?.buyerProfile?.numberOfTemplates ?? FREE_TEMPLATE_LIMIT;
  const canCreateNewTemplate = totalTemplateCount < maxTemplates;

  const [sizingTemplateId, selectSizingTemplateId] = useState<null | string>(
    null,
  );

  const matchingTemplates = filterTemplatesForProject(
    liveSizingTemplates?.data?.data ?? [],
    props.projectGender,
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
                matchingTemplates.find(
                  (template) => template?.id === sizingTemplateId,
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
        {matchingTemplates.length ? (
          matchingTemplates.map?.((template) => {
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
            <span>
              {getNoMatchingSizingTemplateMessage(props.projectGender)}
            </span>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={(e) => {
              if (!matchingTemplates.length) {
                if (canCreateNewTemplate) {
                  props?.handleCreateNewSizingTemplate?.(e);
                  props?.onOpenChange?.(false);
                  setOpen(false);
                } else {
                  props?.onOpenChange?.(false);
                  setOpen(false);
                  router.push("/sizing-templates/buy");
                }
              } else {
                setStage("CONFIRM");
              }
            }}
            fullWidth
            loading={props.loadingCreate}
            disabled={
              loadingLivesizingTemplates ||
              (!sizingTemplateId && !!matchingTemplates.length)
            }
          >
            {matchingTemplates.length || loadingLivesizingTemplates
              ? "Confirm"
              : canCreateNewTemplate
                ? "Create New Sizing Template"
                : `Max ${maxTemplates} Templates Reached (Buy more templates)`}
          </Button>
        </DialogFooter>
        {/* <div className="flex -mt-4">
          {!!matchingTemplates.length &&
            (canCreateNewTemplate ? (
              <button
                onClick={props?.handleCreateNewSizingTemplate}
                className="text-primary font-semibold cursor-pointer flex-1"
              >
                Create a new sizing template
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <span
                  className={cn(
                    "text-muted-foreground text-sm flex-1 text-center",
                  )}
                >
                  Maximum {maxTemplates} templates reached
                </span>
                <button
                  onClick={() => router.push("/sizing-templates/buy")}
                  className="text-primary font-semibold cursor-pointer flex-1"
                >
                  Buy sizing template
                </button>
              </div>
            ))}
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default AcceptBidSizingTemplateInterrupt;
