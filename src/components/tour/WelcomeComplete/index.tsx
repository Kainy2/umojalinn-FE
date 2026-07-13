"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

import type { IWelcomeCompleteProps } from "@/components/tour/WelcomeComplete/@types";

const WelcomeComplete = ({
  open,
  onOpenChange,
  profileRole,
  onInviteClient,
  onCreateProject,
}: IWelcomeCompleteProps) => {
  const isBuyer = profileRole === "BUYER";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[410px] gap-0 p-0">
        {/* <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-4" />
        </button> */}

        <div className="flex flex-col items-center justify-between px-6 pb-6 pt-10 text-center">
          <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Star className="size-5 fill-primary" />
          </span>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center text-[18px]">
              You&apos;re all set! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-sm leading-relaxed text-foreground-body">
              {isBuyer
                ? "You've completed the tour. Create your first project to work with an Umoja App Approved Designer."
                : "You've completed the tour. Invite your clients and start managing your jobs with ease."}
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            fullWidth
            className="mt-8 rounded-lg bg-primary-600"
            onClick={() => {
              onOpenChange(false);

              if (isBuyer) {
                onCreateProject();
                return;
              }

              onInviteClient();
            }}
          >
            {isBuyer ? "Create Your First Project" : "Invite Your First Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeComplete;
