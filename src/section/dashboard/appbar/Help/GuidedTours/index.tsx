import { Check, ChevronLeft, Presentation, Star } from "lucide-react";

import Activity from "@/icons/Activity";
import Grid01 from "@/icons/Grid01";
import Tag03 from "@/icons/Tag03";
import Wallet02 from "@/icons/Wallet02";
import HelpMenuItem from "@/section/dashboard/appbar/Help/MenuItem";
import type {
  IGuidedToursProps,
  IHelpTourOption,
} from "@/section/dashboard/appbar/Help/@types";
import type { TTourName } from "@/constant/tour/@types";

const GettingStartedIcon = () => (
  <span className="flex size-6 items-center justify-center rounded-full border-2 border-current">
    <Star className="size-3 fill-current" />
  </span>
);

const RecommendChangesIcon = () => (
  <span className="relative flex size-6 items-center justify-center">
    <Grid01 className="size-6" />
    <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-sm bg-background">
      <Check className="size-3" strokeWidth={3} />
    </span>
  </span>
);

const TOUR_ICONS: Partial<Record<TTourName, React.ReactNode>> = {
  welcome: <GettingStartedIcon />,
  "create-a-bid": <Activity />,
  "create-a-project": <Grid01 />,
  "review-bid": <Activity />,
  "sizing-template": <Tag03 />,
  "recommend-sizing-changes": <RecommendChangesIcon />,
  "active-projects": <Presentation />,
  wallet: <Wallet02 />,
};

const getTourIcon = (option: IHelpTourOption) =>
  TOUR_ICONS[option.tourId] ?? <Star className="size-6" />;

const GuidedTours = ({
  options,
  isTourActive,
  onBack,
  onStartTour,
}: IGuidedToursProps) => {
  return (
    <div className="p-2">
      <button
        type="button"
        onClick={onBack}
        className="mb-1 flex items-center gap-1 px-3 py-2 text-sm text-foreground-body transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back
      </button>
      <h3 className="px-3 py-2 text-base font-semibold text-foreground">
        Choose a tour to learn a feature
      </h3>
      <div className="mt-1">
        {options.map((option) => (
          <HelpMenuItem
            key={option.tourId}
            icon={getTourIcon(option)}
            title={option.title}
            subtitle={option.description}
            disabled={option.disabled || isTourActive}
            onClick={() => onStartTour(option.tourId)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuidedTours;
