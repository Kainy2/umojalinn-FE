import type { TTourName } from "@/constant/tour/@types";

export type THelpTourOption = {
  tourId: TTourName;
  title: string;
  description: string;
};

export const DESIGNER_HELP_TOUR_OPTIONS: THelpTourOption[] = [
  {
    tourId: "welcome",
    title: "Getting Started",
    description: "Learn the basics of navigating Umoja linn",
  },
  {
    tourId: "create-a-bid",
    title: "Submit Your first Bid",
    description: "Review job details, price milestones, and send a bid.",
  },
  {
    tourId: "sizing-template",
    title: "Manage Sizing Templates",
    description: "Request and review sizing templates",
  },
  {
    tourId: "recommend-sizing-changes",
    title: "Recommend measurement changes",
    description: "Ask clients to update incorrect sizing information.",
  },
  {
    tourId: "active-projects",
    title: "Manage Live Projects",
    description: "Track milestones, payments, and chat with your client",
  },
  {
    tourId: "wallet",
    title: "Wallet",
    description: "Track earnings, withdrawals, invoices, and payment history.",
  },
];

export const BUYER_HELP_TOUR_OPTIONS: THelpTourOption[] = [
  {
    tourId: "welcome",
    title: "Getting Started",
    description: "Learn the basics of navigating Umoja linn",
  },
  {
    tourId: "create-a-project",
    title: "Create a Project",
    description: "Create your first project and bring your outfit to life.",
  },
  {
    tourId: "review-bid",
    title: "Review a Bid",
    description: "Review and accept bid to work with the right designer",
  },
  {
    tourId: "sizing-template",
    title: "Manage Sizing Templates",
    description: "Create, edit, and share sizing templates",
  },
  {
    tourId: "active-projects",
    title: "Manage Live Projects",
    description: "Track milestones, payments, and chat with your designer",
  },
];
