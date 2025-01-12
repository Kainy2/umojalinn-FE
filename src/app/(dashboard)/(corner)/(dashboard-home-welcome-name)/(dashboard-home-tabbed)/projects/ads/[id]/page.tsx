"use client";
import MenuButton from "@/components/custom/MenuButton";
import SectionTitle from "@/components/custom/SectionTitle";
import SizingTemplateTag from "@/components/custom/tag/SizingTemplate";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { uuidToBase62Safe } from "@/lib/uuid";
import ProjectReviewView from "@/section/dashboard/project/Review";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { PopoverClose } from "@radix-ui/react-popover";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const AdsProjectPage = () => {
  const params = useParams<{ id: string }>();

  const { data, isPending } = useGetProjectById(params?.id);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        size="large"
        loading={isPending}
        title={data?.data?.data?.title || "No title"}
        action={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4 text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-0">
              <PopoverClose asChild>
                <MenuButton
                  href={`/project/${uuidToBase62Safe(
                    data?.data?.data?.id || ""
                  )}`}
                  icon={<Edit />}
                >
                  Edit
                </MenuButton>
              </PopoverClose>
              <PopoverClose asChild>
                <MenuButton icon={<Trash className="text-error" />}>
                  Delete job ad
                </MenuButton>
              </PopoverClose>
            </PopoverContent>
          </Popover>
        }
      />

      <div className="grid grid-cols-2 gap-4 max-w-screen-sm items-center justify-start">
        <span className="text-sm text-foreground-body">Sizing Template</span>
        <SizingTemplateTag projectId={params?.id} />
      </div>

      <ProjectReviewView loading={isPending} project={data?.data?.data} />
    </div>
  );
};

export default AdsProjectPage;
