import { cn } from "@/lib/utils";

import type { IHelpMenuItemProps } from "@/section/dashboard/appbar/Help/@types";

const HelpMenuItem = ({
  icon,
  title,
  subtitle,
  onClick,
  disabled,
  showNotificationDot,
}: IHelpMenuItemProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
        !subtitle && "items-center",
      )}
    >
      <span className="relative mt-0.5 shrink-0 text-foreground-body [&>svg]:size-6">
        {icon}
        {showNotificationDot && (
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-sm text-foreground-body">
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
};

export default HelpMenuItem;
