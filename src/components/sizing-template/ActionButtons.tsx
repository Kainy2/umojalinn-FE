"use client";
/**
 * ActionButtons - Save and Submit buttons for sizing template forms.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ActionButtonsProps = {
  onSave?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  showSave?: boolean;
  showSubmit?: boolean;
  className?: string;
  saveDisabled?: boolean;
  submitDisabled?: boolean;
  saveText?: string;
  submitText?: string;
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
  saveText = "Save",
  submitText = "Submit",
}: ActionButtonsProps) => {
  if (!showSave && !showSubmit) return null;

  return (
    <div className={cn("flex gap-3 justify-end animate-in fade-in slide-in-from-bottom-2 duration-300", "lg:justify-end", "md:justify-center", className)}>
      {showSave && (
        <Button variant="outline" onClick={onSave} disabled={loading || saveDisabled} className="min-w-[120px] transition-all duration-200 hover:scale-[1.02]">
          {loading && <Loader2 className="size-4 animate-spin mr-2" />}
          {saveText}
        </Button>
      )}
      {showSubmit && (
        <Button onClick={onSubmit} disabled={loading || submitDisabled} className="min-w-[120px] transition-all duration-200 hover:scale-[1.02]">
          {loading && <Loader2 className="size-4 animate-spin mr-2" />}
          {submitText}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
