"use client";
/**
 * AddCommentModal - Modal for designers to add/edit comments on measurement points.
 */

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextAreaField from "@/components/custom/input/TextAreaField";

type AddCommentModalProps = {
  children: React.ReactNode;
  measurementName: string;
  initialComment?: string;
  onSubmit: (comment: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AddCommentModal = ({
  children,
  measurementName,
  initialComment = "",
  onSubmit,
  open,
  onOpenChange,
}: AddCommentModalProps) => {
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-1 duration-300">{measurementName}</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-75">
            Share your rationale for requested changes
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100">
          <TextAreaField label="" placeholder="Add Comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={200} className="min-h-[100px]" />
        </div>
        <div className="flex justify-end animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-150">
          <Button onClick={handleSubmit} disabled={!comment.trim()} className="w-full">Add Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentModal;
