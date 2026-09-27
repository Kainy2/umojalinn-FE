import {
  FEMALE_SIZING_TEMPLATE,
  MALE_SIZING_TEMPLATE,
} from "@/constant/sizingTemplate";
import { EMileStoneStatus } from "@/types/enum";
import {
  UmojaLinnBid,
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnMilestone,
  UmojaLinnProject,
  UmojaLinnSizingTemplate,
} from "@/types/project";

const STARTED_MILESTONE_STATUSES = new Set<UmojaLinnMilestone["status"]>([
  EMileStoneStatus.PENDING,
  EMileStoneStatus.ACTIVE,
  EMileStoneStatus.IN_REVIEW,
  EMileStoneStatus.APPROVED,
  EMileStoneStatus.DISPUTED,
  EMileStoneStatus.REFUNDED,
]);

function getBidMilestoneTotal(
  bid?: Pick<UmojaLinnBid, "milestones" | "history"> | null,
) {
  if (bid?.milestones?.length) {
    return bid.milestones.length + 1;
  }

  const historyTotal = bid?.history?.at(-1)?.numberOfMileStones;
  if (historyTotal) {
    return historyTotal + 1;
  }

  return 1;
}

type SizingTemplateUpdateProps = Partial<
  UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
>;

export function getCoverImage(project: UmojaLinnProject) {
  return (
    project?.Gallery?.find?.((gallery) => gallery?.isCoverImage)?.imageUrl ||
    "/img/svg/null.svg"
  );
}

export function getBidJobTileProgress(bid: UmojaLinnBid) {
  if (bid.milestones?.length) {
    const startedCount = bid.milestones.filter((milestone) =>
      STARTED_MILESTONE_STATUSES.has(milestone.status),
    ).length;

    return {
      value: startedCount,
      total: getBidMilestoneTotal(bid),
    };
  }

  return {
    value: 0,
    total: getBidMilestoneTotal(bid),
  };
}

export function getProjectJobTileProgress(
  project: UmojaLinnProject,
  acceptedBid?: UmojaLinnBid | null,
) {
  const bid =
    acceptedBid ?? project.bids?.find((item) => item.status === "ACCEPTED");
  const total = getBidMilestoneTotal(bid);

  if (project.status === "COMPLETED") {
    return { value: total, total };
  }

  const percentage = Math.min(
    Math.max(project.percentageCompleted ?? 0, 0),
    100,
  );
  const value =
    total === 1
      ? percentage >= 100
        ? 1
        : 0
      : Math.round((percentage / 100) * total);

  return { value, total };
}

export function getSizingTemplateUpdateProps(
  gender: UmojaLinnSizingTemplate["gender"],
  entries: Partial<
    UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
  >
) {
  const res: SizingTemplateUpdateProps = {};

  (gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE).map(
    (template) => {
      if (entries?.[template.prop])
        res[template.prop] = entries?.[template.prop] as null | undefined;
    }
  );
  return res;
}
