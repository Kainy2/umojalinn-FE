"use client";
import useClipboard from "@/hooks/useClipboard";
import Copy from "@/icons/Copy";
import React from "react";

type CopyLabelValueProps = {
  label: string;
  value: string;
};

const CopyLabelValue = (props: CopyLabelValueProps) => {
  const { handleCopy } = useClipboard();
  return (
    <div>
      <p className="font-semibold mb-1">{props.label}</p>
      <button
        className="flex w-full text-left text-subtitle-2 justify-between items-center relative [&>svg]:text-primary [&>svg]:opacity-0 [&:hover>svg]:opacity-100 cursor-pointer [&>svg]:transition-opacity"
        onClick={() => handleCopy(props.value)}
      >
        <span className="flex-1 ">{props.value}</span> <Copy />
      </button>
    </div>
  );
};

export default CopyLabelValue;
