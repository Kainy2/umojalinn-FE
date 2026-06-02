"use client";

import React from "react";
import useClipboard from "@/hooks/useClipboard";
import Copy from "@/icons/Copy";

type TReceivingAccountFieldProps = {
  label: string;
  value: string;
  hint?: string;
};

const ReceivingAccountField = ({
  label,
  value,
  hint,
}: TReceivingAccountFieldProps) => {
  const { handleCopy } = useClipboard();

  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 py-3 sm:grid-cols-2 sm:gap-4">
      <p className="text-sm font-medium text-foreground-body">{label}</p>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground break-words">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={() => handleCopy(value)}
          className="shrink-0 text-primary hover:opacity-80"
          aria-label={`Copy ${label}`}
        >
          <Copy />
        </button>
      </div>
    </div>
  );
};

export default ReceivingAccountField;
