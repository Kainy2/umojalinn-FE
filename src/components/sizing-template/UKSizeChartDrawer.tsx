"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UK_SIZE_CHART_MALE, UK_SIZE_CHART_FEMALE } from "@/types/constants";

interface UKSizeChartDrawerProps {
  gender: "MALE" | "FEMALE";
  isOpen: boolean;
  onClose: () => void;
}

export function UKSizeChartDrawer({
  gender,
  isOpen,
  onClose,
}: UKSizeChartDrawerProps) {
  const chartData = gender === "MALE" ? UK_SIZE_CHART_MALE : UK_SIZE_CHART_FEMALE;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {gender === "MALE" ? "Men's" : "Women's"} Size Chart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <p className="text-sm text-gray-600 mb-4">
            Use this chart to find your standard size based on UK, US, or EU sizing.
          </p>

          {/* Scrollable Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                    UK Size
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                    US Size
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                    EU Size
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                    FR Size
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                    Letter
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr
                    key={row.ukSize}
                    className={cn(
                      "hover:bg-amber-50 transition-colors",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      {row.ukSize}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {row.usSize}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {row.euSize}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {row.frSize}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {row.letterSize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: Sizes may vary between brands. When in doubt, please check the specific brand&apos;s size guide.
          </p>
        </div>
      </div>
    </>
  );
}

export default UKSizeChartDrawer;

