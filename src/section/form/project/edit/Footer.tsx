"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";

type ProjectEditFooterProps = {
  loading: boolean;
  handleDraft?: React.ComponentProps<"button">["onClick"];
  handleSave?: React.ComponentProps<"button">["onClick"];
  hideDraft?: boolean;
  hideBack?: boolean;
};

const ProjectEditFooter = (props: ProjectEditFooterProps) => {
  const router = useRouter();
  return (
    <div className="mt-6">
      <Separator className="bg-gray-200" />
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        {!props.hideBack && (
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        {!props.hideDraft && (
          <Button
            name="submit"
            value="save_and_submit"
            onClick={props.handleDraft}
            disabled={props.loading}
            type="submit"
            variant="outline"
          >
            Save & Exit
          </Button>
        )}
        <Button
          name="submit"
          value="save_and_continue"
          disabled={props.loading}
          type="submit"
          variant="default"
          onClick={props.handleSave}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ProjectEditFooter;
