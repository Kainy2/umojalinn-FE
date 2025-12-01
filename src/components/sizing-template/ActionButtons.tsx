"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonsProps = {
  onSave?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  showSave?: boolean;
  showSubmit?: boolean;
  className?: string;
  saveDisabled?: boolean;
  submitDisabled?: boolean;
};

const ActionButtons = ({
  onSave,
  onSubmit,
  loading,
  showSave = false,
  showSubmit = false,
  className,
  saveDisabled = false,
  submitDisabled = false,
}: ActionButtonsProps) => {
  if (!showSave && !showSubmit) return null;

  return (
    <div
      className={cn(
        "flex gap-3 justify-end",
        "lg:justify-end",
        "md:justify-center",
        className
      )}
    >
      {showSave && (
        <Button
          variant="outline"
          onClick={onSave}
          disabled={loading || saveDisabled}
          className="min-w-[120px]"
        >
          Save
        </Button>
      )}
      {showSubmit && (
        <Button
          onClick={onSubmit}
          disabled={loading || submitDisabled}
          className="min-w-[120px]"
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;

