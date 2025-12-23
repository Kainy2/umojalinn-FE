"use client";
/**
 * MeasurementPointRow - Individual row for a measurement point.
 * Supports normal mode, highlighted state, recommend mode with checkboxes, and submitted state.
 */

import React, { useId, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";
import { MessageCircleQuestion, MessageCircle, Trash2, MessageCirclePlus, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
import { Checkbox } from "@/components/ui/checkbox";
import AddCommentModal from "./AddCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";

type MeasurementPointRowProps = {
  label: string;
  unit: UmojaLinnSizingTemplate["unit"];
  value?: number;
  onValueChange?: React.ComponentProps<"input">["onChange"];
  onFocus?: React.ComponentProps<"input">["onFocus"];
  disabled?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  hasLiveProject?: boolean;
  onKeyDown?: React.ComponentProps<"input">["onKeyDown"];
  metadata?: { review?: string; img?: string };
  // Recommend mode props
  recommendMode?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  hasComment?: boolean;
  comment?: string;
  onAddComment?: (comment: string) => void;
  onDeleteComment?: () => void;
  isSubmitted?: boolean;
};

const MeasurementPointRow = forwardRef<HTMLInputElement, MeasurementPointRowProps>((props, ref) => {
  const id = useId();
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onSelect?.();
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddCommentModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteCommentModal(true);
  };

  return (
    <div
      onClick={props.onClick}
      className={cn(
        "flex justify-between items-center p-3 rounded-lg transition-all duration-200",
        props.recommendMode ? "cursor-default" : "cursor-pointer hover:scale-[1.01]",
        props.highlighted && !props.recommendMode
          ? "bg-primary text-white shadow-sm scale-[1.01]"
          : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm",
        props.selected && props.recommendMode && "border-primary bg-amber-50 scale-[1.01]",
        props.isSubmitted && "border-green-500 bg-green-50"
      )}
    >
      {/* Left side: Checkbox, Label, Submitted indicator */}
      <div className="flex items-center gap-3">
        {props.recommendMode && (
          <div onClick={handleCheckboxClick}>
            <Checkbox
              checked={props.selected}
              onCheckedChange={props.onSelect}
              className={cn("transition-all duration-200", props.selected && "border-primary data-[state=checked]:bg-primary")}
            />
          </div>
        )}
        <label
          className={cn(
            "text-sm font-medium transition-colors",
            props.highlighted && !props.recommendMode ? "text-white" : "text-foreground-body",
            props.metadata?.review && !props.hasLiveProject && !props.highlighted && "text-error-700 font-semibold",
            props.selected && props.recommendMode && "text-primary font-semibold"
          )}
          htmlFor={id}
        >
          {props.label}
        </label>
        {props.isSubmitted && (
          <div className="size-5 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-0 duration-300">
            <Check className="size-3 text-white" />
          </div>
        )}
      </div>
      
      {/* Right side: Value/Input, Actions */}
      <div className="flex items-center gap-2">
        <div className="text-sm rounded-full relative">
          {props.disabled ? (
            <span className={cn("text-right pr-10", props.unit === "INCH" && "pr-14", props.highlighted ? "text-white" : "text-gray-500")}>
              {props.value || 0}
            </span>
          ) : (
            <input
              ref={ref}
              className={cn(
                "text-right placeholder:text-gray-400 focus-visible:outline-none rounded-full p-1 pr-10 w-20",
                props.unit === "INCH" && "pr-14",
                props.highlighted ? "bg-white/10 text-white transition-all placeholder:text-white/70" : "text-gray-500 focus-visible:bg-gray-100"
              )}
              id={id}
              type="number"
              min={0}
              max={999}
              onChange={props.onValueChange}
              value={props.value || ""}
              placeholder="0"
              onFocus={props.onFocus}
              autoComplete="off"
              disabled={props.disabled}
              onClick={props.onClick}
              onKeyDown={props.onKeyDown}
            />
          )}
          <div className={cn("absolute inset-y-0 right-0 top-0.5 flex items-center pr-4 pointer-events-none text-xs", props.highlighted ? "text-white" : "text-gray-500")}>
            {props.unit}
          </div>
        </div>

        {/* Recommend Mode Actions */}
        {props.recommendMode && props.selected && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300" onClick={(e) => e.stopPropagation()}>
            {!props.hasComment ? (
              <AddCommentModal
                measurementName={props.label}
                onSubmit={(comment) => { props.onAddComment?.(comment); setShowAddCommentModal(false); }}
                open={showAddCommentModal}
                onOpenChange={setShowAddCommentModal}
              >
                <button onClick={handleCommentClick} className="size-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-200 hover:scale-110">
                  <MessageCirclePlus className="size-4 text-primary" />
                </button>
              </AddCommentModal>
            ) : (
              <>
                <AddCommentModal
                  measurementName={props.label}
                  initialComment={props.comment}
                  onSubmit={(comment) => { props.onAddComment?.(comment); setShowAddCommentModal(false); }}
                  open={showAddCommentModal}
                  onOpenChange={setShowAddCommentModal}
                >
                  <button onClick={handleCommentClick} className="size-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-110">
                    <MessageCircle className="size-4 text-white" />
                  </button>
                </AddCommentModal>
                <DeleteCommentModal
                  onConfirm={() => { props.onDeleteComment?.(); setShowDeleteCommentModal(false); }}
                  open={showDeleteCommentModal}
                  onOpenChange={setShowDeleteCommentModal}
                >
                  <button onClick={handleDeleteClick} className="size-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-all duration-200 hover:scale-110">
                    <Trash2 className="size-4 text-red-600" />
                  </button>
                </DeleteCommentModal>
              </>
            )}
          </div>
        )}

        {/* Mobile Preview Dialog */}
        {props.metadata && !props.recommendMode && (
          <Dialog>
            <DialogTrigger asChild>
              <button className={cn("lg:hidden", props.highlighted ? "text-white" : "text-primary")}>
                <MessageCircleQuestion className="size-5 text-gray-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] max-w-[425px] max-h-[80vh] h-[80vh]">
              <div className="h-full w-full relative">
                <DialogTitle className="text-lg font-semibold mb-4">{props.label}</DialogTitle>
                <div className="h-full w-full relative">
                  <Image src={props.metadata?.img || ""} fill alt={`Guide for ${props.label}`} className="absolute object-contain h-full w-full" />
                  {!!props.metadata?.review && !props.hasLiveProject && (
                    <RequestSizingTemplateViewCard className="absolute top-0" title={props?.label || ""} review={props?.metadata?.review || ""} />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
});

MeasurementPointRow.displayName = "MeasurementPointRow";

export default MeasurementPointRow;
