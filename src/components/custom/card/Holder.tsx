import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";
import { CustomCardProps } from ".";
import { capitalizeFirstLetter, replaceSubsection } from "@/lib/string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";

export type CustomCardHolderProps = {
  title?: string;
  colour?: "success" | "primary" | "info";
  count?: number;
  children?: React.ReactNode;
  empty?: boolean;
  loading?: boolean;
  type?: CustomCardProps["type"];
  options?: string[];
  onSelect?: (selection: string) => void;
};

const CustomCardHolderChildren = (
  props: Pick<CustomCardHolderProps, "title" | "children" | "empty" | "loading">
) => {
  if (props.loading) {
    return new Array(4)
      .fill("")
      .map((_, i) => <Skeleton className="h-52 bg-gray-200" key={i} />);
  }
  if (props.empty) {
    return (
      <p className="h-52 flex items-center justify-center text-foreground-body/50 text-center text-sm">
        {`No ${
          replaceSubsection(props.title || "", "My") || "data available."
        } available`}
      </p>
    );
  }
  return props.children;
};

const CustomCardHolder = (props: CustomCardHolderProps) => {
  const { empty, loading, type, count, title, children, colour } = props;

  if (type === "PROJECT") {
    if (loading) {
      return (
        <div className="flex gap-4 overflow-scroll">
          {new Array(4).fill("").map((_, i) => (
            <Skeleton key={i} className="h-28 min-w-80" />
          ))}
        </div>
      );
    }
    return <div className="flex gap-4 overflow-scroll">{children}</div>;
  }

  return (
    <div className="bg-gray-100 p-4 flex-1 w-full h-full pt-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={!props.options?.length}
            className={cn(
              "font-semibold text-sm truncate flex gap-2 mx-auto mb-6 p-2 text-teal-500 uppercase w-fit",
              colour === "success" && "text-success",
              colour === "info" && "text-gray-500",
              colour === "primary" && "text-primary"
            )}
          >
            {!!count && (
              <span
                className={cn(
                  "h-5 w-5 flex items-center justify-center text-white bg-teal-500 text-sm",
                  colour === "success" && "bg-success",
                  colour === "info" && "bg-gray-500",
                  colour === "primary" && "bg-primary"
                )}
              >
                {count}
              </span>
            )}{" "}
            {title}
            {props?.options?.length && <ChevronDown className="size-4" />}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div>
            {props?.options?.map((option, i) => (
              <PopoverClose key={i}>
                <button
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1 pl-8 pr-2 text-sm text-left outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => props?.onSelect?.(option)}
                >
                  {capitalizeFirstLetter(option)?.replaceAll("_", " ")}
                </button>
              </PopoverClose>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col gap-2">
        <CustomCardHolderChildren {...{ title, empty, loading }}>
          {children}
        </CustomCardHolderChildren>
      </div>
    </div>
  );
};

export default CustomCardHolder;
