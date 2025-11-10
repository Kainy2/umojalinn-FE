"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    showHelpText?: boolean;
    checkedHelpText?: string;
    uncheckedHelpText?: string;
  }
>(({ className, showHelpText, checkedHelpText, uncheckedHelpText, ...props }, ref) => {

  if (showHelpText && ((checkedHelpText?.length && checkedHelpText.length > 5) || 
    (uncheckedHelpText?.length && uncheckedHelpText.length > 5 ))) {
    checkedHelpText = checkedHelpText?.slice(0, 4) + "..."
    uncheckedHelpText = uncheckedHelpText?.slice(0, 4) + "..."
  }
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input relative transition-all",
        // showHelpText && "h-7 w-16",
        // !showHelpText && "h-7 w-16",
        className
      )}
      {...props}
      ref={ref}
    >
      {/* {showHelpText && (
        <span
          className={cn(
            "text-xs text-[11px] text-gray-600 font-semibold absolute top-1/2 left-1/2 -translate-y-1/2 transition-all",
            props.checked ? "-translate-x-[95%]" : "-translate-x-[5%]"
                        // props.checked ? "left-[12%]" : "left-[48%]"
          )}
        >
          {props.checked
            ? checkedHelpText ?? "True"
            : uncheckedHelpText ?? "False"}
        </span>
      )} */}
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 transition-all",
          // showHelpText && "h-6 w-6 data-[state=checked]:translate-x-9",
          // !showHelpText && "h-6 w-6 data-[state=checked]:translate-x-9"
        )} />


    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
