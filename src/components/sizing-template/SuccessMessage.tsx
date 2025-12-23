"use client";
/**
 * SuccessMessage - Success/status banner for sizing template actions.
 */

import { CheckCircle, Save } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type SuccessMessageVariant = "saved" | "submitted" | "default";

type SuccessMessageProps = {
  variant?: SuccessMessageVariant;
  message?: string;
  className?: string;
};

const variantConfig = {
  saved: {
    icon: Save,
    title: "Saved Measurement Points",
    description: "Your measurement point has been saved. Please return to submit it and continue the project.",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  submitted: {
    icon: CheckCircle,
    title: "Measurements Submitted",
    description: "We've successfully sent your sizing measurements!",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  default: {
    icon: Save,
    title: "Success",
    description: "Your changes have been saved successfully.",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
};

const SuccessMessage = ({ variant = "default", message, className }: SuccessMessageProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg p-4 flex items-start gap-3 border transition-all duration-300 animate-in fade-in slide-in-from-top-2", config.bgColor, config.borderColor, className)}>
      <div className={cn("size-8 shrink-0 flex items-center justify-center rounded-full animate-in zoom-in duration-300 delay-100", config.iconBgColor)}>
        <Icon className={cn("size-4", config.iconColor)} />
      </div>
      <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-300 delay-150">
        <p className="font-semibold text-foreground-body mb-1">{config.title}</p>
        <p className="text-sm text-muted-foreground">{message || config.description}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
