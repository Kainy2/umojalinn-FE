"use client";

import { cn } from "@/lib/utils";
import { UK_SIZE_CHART_MALE, UK_SIZE_CHART_FEMALE } from "@/constant";

interface UKSizeChartTableProps {
  gender: "MALE" | "FEMALE";
  className?: string;
}

export function UKSizeChartTable({ gender, className }: UKSizeChartTableProps) {
  const chartData = gender === "MALE" ? UK_SIZE_CHART_MALE : UK_SIZE_CHART_FEMALE;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <h3 className="text-lg font-semibold mb-3">
        {gender === "MALE" ? "Men's" : "Women's"} Size Chart
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Use this chart to find your standard size based on UK, US, or EU sizing.
      </p>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                UK
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                US
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                EU
              </th>
              <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                FR
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
        Note: Sizes may vary between brands.
      </p>
    </div>
  );
}

export default UKSizeChartTable;

