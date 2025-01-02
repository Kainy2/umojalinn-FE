import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";
import { CustomCardProps } from ".";

type CustomCardHolderProps = {
  title?: string;
  colour?: string;
  count?: number;
  children?: React.ReactNode;
  empty?: boolean;
  loading?: boolean;
  type?: CustomCardProps["type"];
};

const CustomCardHolderChildren = (
  props: Pick<CustomCardHolderProps, "children" | "empty" | "loading">
) => {
  if (props.empty) {
    return (
      <p className="h-52 flex items-center justify-center text-foreground-body/50 text-center text-sm">
        No data available.
      </p>
    );
  }
  if (props.loading) {
    return new Array(4)
      .fill("")
      .map((_, i) => <Skeleton className="h-52" key={i} />);
  }
  return props.children;
};

const CustomCardHolder = (props: CustomCardHolderProps) => {
  const { empty, loading, type, count, title, children } = props;

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
    <div className="bg-gray-100 p-4 flex-1 w-full h-full">
      <h6
        className={cn(
          "font-semibold truncate flex gap-2 items-center justify-center mb-8 text-teal-500"
        )}
      >
        {!!count && (
          <span className="h-5 w-5 flex items-center justify-center text-white bg-teal-500 text-sm">
            {count}
          </span>
        )}{" "}
        {title}
      </h6>
      <div className="flex flex-col gap-2">
        <CustomCardHolderChildren {...{ empty, loading }}>
          {children}
        </CustomCardHolderChildren>
      </div>
    </div>
  );
};

export default CustomCardHolder;
