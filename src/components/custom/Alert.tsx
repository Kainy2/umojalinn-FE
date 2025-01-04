import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";

type AlertProps = {
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
};

const Alert = (props: AlertProps) => {
  let Icon;
  let colorStyle;
  switch (props.type) {
    case "success":
      Icon = CheckCircle;
      colorStyle = "bg-success-50 border-success [&>svg]:text-success";
      break;
    case "error":
      Icon = AlertCircle;
      colorStyle = "bg-error-50 border-error [&>svg]:text-error";
      break;
    case "info":
      Icon = AlertCircle;
      colorStyle = "bg-info-50 border-info [&>svg]:text-info";
      break;
    case "warning":
    default:
      Icon = AlertCircle;
      colorStyle = "bg-primary-50 border-primary [&>svg]:text-primary";
      break;
  }
  return (
    <div className={cn("flex gap-2 p-4 border", colorStyle)}>
      <Icon />
      <div className="flex-1 text-foreground-body">
        <h3 className="font-semibold mb-1">{props.title}</h3>
        <p className="text-sm">{props.message}</p>
      </div>
    </div>
  );
};

export default Alert;
