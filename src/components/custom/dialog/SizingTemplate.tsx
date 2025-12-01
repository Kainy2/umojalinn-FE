"use client";
import { SizingTemplateDialogProps } from "@/hooks/use-sizing-template";
import { useRouter } from "next/navigation";
import React from "react";
import { uuidToBase62Safe } from "@/lib/uuid";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

/**
 * This component now navigates to a full-screen page instead of opening a modal.
 * The dialog wrapper is kept for backward compatibility with existing code.
 */
const SizingTemplateDialog = ({
  children,
  id,
}: SizingTemplateDialogProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/sizing-templates/${uuidToBase62Safe(id)}`);
    } else {
      router.push("/sizing-templates/new");
    }
  };

  // If children are provided, wrap them in a clickable element
  if (children) {
    return (
      <Dialog>
      <DialogTrigger asChild onClick={handleClick}>
        {/* <div onClick={handleClick} className="cursor-pointer border rounded-lg"> */}
        {children}
      {/* </div> */}
      </DialogTrigger>
      </Dialog>

    );
  }

  // If no children, this shouldn't be used as a trigger
  return null;
};

export default SizingTemplateDialog;


