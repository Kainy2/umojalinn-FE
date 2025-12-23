"use client";
/**
 * DeleteCommentModal - Confirmation modal for deleting comments.
 */

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DeleteCommentModalProps = {
  children: React.ReactNode;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DeleteCommentModal = ({
  children,
  onConfirm,
  open,
  onOpenChange,
}: DeleteCommentModalProps) => {
  const handleDelete = () => {
    onConfirm();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <div className="size-12 mx-auto mb-4 flex items-center justify-center bg-red-50 rounded-full animate-in zoom-in-0 duration-300">
            <Trash2 className="size-6 text-red-600" />
          </div>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-1 duration-300">Delete comment</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-75">
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-100">
          <Button variant="outline" onClick={() => onOpenChange?.(false)} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentModal;
