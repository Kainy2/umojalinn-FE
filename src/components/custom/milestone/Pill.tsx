import {
  getLabel,
  getPillValueStyle,
  getPillWrapperStyle,
} from "@/components/util/milestone";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { MilestoneStatus, MilestoneTimelineItem, MilestoneTimelineProps } from "./Timeline";
import { formatCurrencyValue } from "@/lib/number";

const MilestonePill: React.FC<
  MilestoneTimelineItem & Pick<MilestoneTimelineProps, "currency" | "escrowBalance">
> = ({ amount, currency, escrowBalance = 0, status, variableSubmissions }) => {
  const variableStatus = variableSubmissions?.[0]?.status === "PENDING" ? "IN_REVIEW" : status
  const nonVariableAmount = variableStatus === MilestoneStatus.AWAITING_FUND ? amount - escrowBalance : amount
  const variableAmount = nonVariableAmount
  //  If you want buyer to see the variable amount in the pill
  // while he's reviewing variable amount submission, use this below.
  // else, he will see only the accepted prices in the pill
  //  variableAmount = variableSubmissions?.[0]?.status === "PENDING" ? variableSubmissions?.[0]?.amount : nonVariableAmount

  console.log(variableStatus)

  const label = getLabel(variableStatus);
  console.log(label)
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
