import {
  Calendar,
  GraduationCap,
  Mail,
  Users,
} from "lucide-react";

import type { THelpCentreActionId } from "@/constant/help";
import MessageSquare02 from "@/icons/MessageSquare02";
import HelpMenuItem from "@/section/dashboard/appbar/Help/MenuItem";
import type { IHelpCentreProps } from "@/section/dashboard/appbar/Help/@types";

const HELP_CENTRE_ICONS: Record<THelpCentreActionId, React.ReactNode> = {
  "guided-tours": <GraduationCap />,
  chat: <MessageSquare02 />,
  webinars: <Users />,
  demo: <Calendar />,
  email: <Mail />,
  contact: <Mail />,
};

const HelpCentre = ({ options, onSelectAction }: IHelpCentreProps) => {
  return (
    <div className="p-2">
      <h3 className="px-3 py-2 text-base font-semibold text-foreground">
        Welcome to your Help Centre!
      </h3>
      <div className="mt-1">
        {options.map((option) => (
          <HelpMenuItem
            key={option.id}
            icon={HELP_CENTRE_ICONS[option.id]}
            title={option.label}
            showNotificationDot={option.showNotificationDot}
            onClick={() => onSelectAction(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HelpCentre;
