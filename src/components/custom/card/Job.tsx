import React from "react";
import CustomCard from ".";
import { EyeOff, MessageSquare, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import JoinMeet from "@/icons/JoinMeet";
import { Separator } from "@/components/ui/separator";
import MilestoneProgress from "../milestone/Progress";

type JobCardProps = {
  blurred?: boolean;
  disabled?: boolean;
  isPrivate?: boolean;
  name: string;
  img: string;
  progress?: {
    value: number;
    total: number;
  };
  dueDate?: Date | string | null;
  sharedWith?: string[];
  status?: {
    color?: string;
    value?: string;
  };
  meetingUrl?: string;
  attachedFileCount?: number;
  messageCount?: number;
  newMessage?: boolean;
  href?: string;
};

const JobCard = (props: JobCardProps) => {
  return (
    <CustomCard
      type="DASHBOARD"
      href={props?.href}
      blurred={props?.blurred}
      disabled={props?.disabled}
      preTitle={
        props?.isPrivate ? (
          <EyeOff className="text-teal-500 h-6 w-6" />
        ) : undefined
      }
      title={props?.name}
      preDescription={
        props?.progress && (
          <MilestoneProgress className="mb-4" {...props?.progress} />
        )
      }
      description={
        props?.dueDate
          ? `Due in ${format(new Date(props?.dueDate), "MMM dd")}`
          : undefined
      }
      img={props?.img}
      action={
        <div className="flex">
          <div className="flex-1 shrink-0 flex -space-x-2">
              <Avatar className="h-7 w-7 border-background border ">
                <AvatarImage src={props.img} width={40} height={40} />
              </Avatar>
            {/* {props?.sharedWith?.map((user) => (
            ))} */}
          </div>
          <div className="flex-1 shrink-0 flex justify-center">
            {!!props?.meetingUrl && (
              <a href={props?.meetingUrl}>
                <JoinMeet />
              </a>
            )}
          </div>
          <div className="flex-1 shrink-0 justify-end">
            {props?.status ? (
              <p style={{ color: props?.status?.color }} className={cn("text-gray-400 pt-1.5 text-sm text-right")}>{props?.status?.value}</p>
            ) : (
              <div
                className={cn(
                  "flex text-foreground text-sm items-center gap-1",
                  props?.newMessage && "text-success"
                )}
              >
                <Paperclip className="h-4 w-4" />
                <p className="text-inherit">{props?.attachedFileCount || 0}</p>
                <Separator orientation="vertical" className="mx-0.5 h-5" />
                <MessageSquare className="h-4 w-4" />
                <p className="text-inherit">{props?.messageCount || 0}</p>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default JobCard;
