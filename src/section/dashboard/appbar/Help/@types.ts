import type { TTourName } from "@/constant/tour/@types";
import type {
  THelpCentreActionId,
  THelpCentreOption,
} from "@/constant/help";

export type THelpView = "help-centre" | "guided-tours";

export interface IHelpTourOption {
  tourId: TTourName;
  title: string;
  description: string;
  disabled?: boolean;
}

export interface IHelpMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  disabled?: boolean;
  showNotificationDot?: boolean;
}

export interface IHelpCentreProps {
  options: THelpCentreOption[];
  onSelectAction: (actionId: THelpCentreActionId) => void;
}

export interface IGuidedToursProps {
  options: IHelpTourOption[];
  isTourActive: boolean;
  onBack: () => void;
  onStartTour: (tourId: TTourName) => void;
}
