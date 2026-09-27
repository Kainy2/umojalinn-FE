"use client";
/**
 * SavedMeasurementsNotice - Banner showing saved/submitted status with optional submit action.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Save, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type NoticeVariant = "saved" | "submitted" | "error";

type SavedMeasurementsNoticeProps = {
  variant?: NoticeVariant;
  message?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  className?: string;
};

const variantConfig = {
  saved: {
    icon: Save,
    title: "Saved Measurement Points",
    description: "Your measurement points have been saved. Please return to submit it and continue the project.",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
    showSubmitAction: true,
  },
  submitted: {
    icon: CheckCircle,
    title: "Measurements Submitted",
    description: "We've successfully sent your sizing measurements!",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    showSubmitAction: false,
  },
  error: {
    icon: AlertCircle,
    title: "Error Saving Measurements",
    description: "There was an error saving your measurements. Please try again.",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    showSubmitAction: false,
  },
};

const SavedMeasurementsNotice = ({
  variant = "saved",
  message,
  onSubmit,
  isSubmitting = false,
  className,
}: SavedMeasurementsNoticeProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-2", config.bgColor, config.borderColor, className)}>
      <div className={cn("shrink-0 mt-0.5 animate-in zoom-in duration-300 delay-100", config.iconColor)}>
        <Icon className="size-5" />
      </div>
      <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300 delay-150">
        <p className="font-semibold text-sm text-foreground-body">{config.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{message || config.description}</p>
      </div>
      {config.showSubmitAction && onSubmit && (
        <Button size="sm" variant="ghost" onClick={onSubmit} disabled={isSubmitting} className={cn("shrink-0 animate-in fade-in slide-in-from-right-2 duration-300 delay-200", "text-amber-700 hover:text-amber-900 hover:bg-amber-100")}>
          {isSubmitting ? "Submitting..." : (<>Submit now<ArrowRight className="size-4 ml-1" /></>)}
        </Button>
      )}
    </div>
  );
};

export default SavedMeasurementsNotice;
