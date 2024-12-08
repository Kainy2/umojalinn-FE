"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type OnboardActionButtonsProps = {
  hideBack?: boolean;
  hideNext?: boolean;
  hideSkip?: boolean;
  skipHref: string;
  onNextClick?: React.ComponentProps<"button">["onClick"];
};

const OnboardActionButtons = (props: OnboardActionButtonsProps) => {
  const router = useRouter();
  const { hideBack, hideNext, hideSkip, onNextClick, skipHref } = props;

  return (
    <>
      <div className="flex gap-y-4 gap-x-2 mb-8">
        <Button
          variant="outline"
          fullWidth
          type="button"
          className={cn(hideBack && "hidden")}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          fullWidth
          onClick={onNextClick}
          type="submit"
          className={cn(hideNext && "hidden")}
        >
          Next
        </Button>
      </div>
      <Link
        href={skipHref}
        className={cn("text-primary font-bold mx-auto", hideSkip && "hidden")}
        type="button"
      >
        Skip
      </Link>
    </>
  );
};

export default OnboardActionButtons;
