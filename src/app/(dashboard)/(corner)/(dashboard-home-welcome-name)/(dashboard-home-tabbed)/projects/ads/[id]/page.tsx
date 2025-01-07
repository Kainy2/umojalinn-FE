"use client";
import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import MenuButton from "@/components/custom/MenuButton";
import SectionTitle from "@/components/custom/SectionTitle";
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
import { Edit, MoreVertical, Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const AdsProjectPage = () => {
  const params = useParams<{ id: string }>();

  const { data } = useGetProjectById(params?.id);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        size="large"
        title={data?.data?.data?.title || "No title"}
        action={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4 text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-1">
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
        <span>
          <AvatarIconTag
            label="No sizing template"
            icon={
              <span className="bg-background border-dotted border border-primary text-primary h-6 w-6 flex items-center justify-center rounded-full">
                <Plus className="h-4 w-4" />
              </span>
            }
          />
        </span>
      </div>
      <ProjectReviewView project={data?.data?.data} />
    </div>
  );
};

export default AdsProjectPage;
