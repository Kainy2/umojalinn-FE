import {
  getLabel,
  getPillValueStyle,
  getPillWrapperStyle,
} from "@/components/util/milestone";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { MilestoneTimelineItem, MilestoneTimelineProps } from "./Timeline";
import { formatCurrencyValue } from "@/lib/number";

const MilestonePill: React.FC<
  MilestoneTimelineItem & Pick<MilestoneTimelineProps, "currency">
> = ({ amount, currency, status, variableSubmissions }) => {
  const variableStatus = variableSubmissions?.[0]?.status === "PENDING" ? "IN_REVIEW" : status
  const variableAmount = variableSubmissions?.[0]?.status === "PENDING" ? variableSubmissions?.[0]?.amount : amount

  const label = getLabel(variableStatus);
  const wrapperStyle = getPillWrapperStyle(variableStatus);
  const valueStyle = getPillValueStyle(variableStatus);
  return (
    <span
      className={cn(
        "flex items-center font-medium gap-2 p-0.5 rounded-full border border-gray-400 text-xs text-gray-400",
        wrapperStyle
      )}
    >
      {(label) && <span className="ml-2">{label}</span>}
      <span
        className={cn(
          "bg-gray-400 text-gray-50 px-1.5 py-0.5 rounded-full",
          valueStyle
        )}
      >
        {getCurrencySymbol(currency)}
        {formatCurrencyValue(variableAmount)}
      </span>
    </span>
  );
};

export default MilestonePill;
