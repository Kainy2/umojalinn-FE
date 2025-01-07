"use client";
import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import SectionTitle from "@/components/custom/SectionTitle";
import CheckCircle from "@/icons/CheckCircle";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { format } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const ActiveProjectSummary = () => {
  const params = useParams<{ id: string }>();
  const { data, isPending } = useGetProjectById(params.id);
  if (isPending) {
    return "";
  }
  return (
    <div className="flex flex-col">
      <SectionTitle
        size="large"
        title={data?.data?.data?.title || "No Title"}
      />
      <div className="grid grid-cols-2 gap-4 max-w-screen-sm items-center justify-start">
        <span className="text-sm text-foreground-body">Detail</span>
        <span>
          <AvatarIconTag
            label={`${data?.data?.data?.designer?.user?.firstName} ${data?.data?.data?.designer?.user?.lastName}`}
            avatar={{
              src: data?.data?.data?.designer?.user?.profilePhotoUri,
            }}
          />
        </span>
        <span className="text-sm text-foreground-body">Sizing Template</span>
        <span>
          <AvatarIconTag
            label="View sizing templates"
            icon={<CheckCircle className="text-success" />}
          />
        </span>
        <span className="text-sm text-foreground-body">Timeline</span>
        <span>
          <AvatarIconTag
            label={`${format(
              new Date(data?.data.data?.createdAt || 0),
              "MMM dd, yyy"
            )} to ${format(
              new Date(data?.data.data?.dueDate || 0),
              "MMM dd, yyy"
            )}`}
            icon={<CalendarPlus className="text-primary h-5 w-5" />}
          />
        </span>
      </div>
    </div>
  );
};

export default ActiveProjectSummary;
