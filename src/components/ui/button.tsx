import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-md font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border text-foreground-body border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-primary-foreground hover:bg-success/90",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  href?: string;
}

const Button = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      href,
      size,
      asChild = false,
      fullWidth,
      children,
      loading,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp: React.ElementType = asChild ? Slot : href ? Link : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full"
        )}
        ref={ref as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
        {...(href ? { href } : {})}
        {...props}
        disabled={loading || disabled}
      >
        {loading ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a11" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="currentColor"></stop><stop offset=".3" stop-color="currentColor" stop-opacity=".9"></stop><stop offset=".6" stop-color="currentColor" stop-opacity=".6"></stop><stop offset=".8" stop-color="currentColor" stop-opacity=".3"></stop><stop offset="1" stop-color="currentColor" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a11)" stroke-width="25" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="currentColor" stroke-width="25" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
