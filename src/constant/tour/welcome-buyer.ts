import type { Tour } from "nextstepjs";

import type { TTourTargetId } from "@/constant/tour/@types";

const tourTarget = (id: TTourTargetId) => `#${id}`;

const WELCOME_TOUR_POINTER = {
  pointerPadding: 4,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
  side: "right" as const,
};

const APPBAR_TOUR_POINTER = {
  showControls: true,
  showSkip: true,
  pointerPadding: 8,
  pointerRadius: 8,
  side: "bottom-right" as const,
};

export const buildBuyerWelcomeTour = (): Tour => {
  return {
    tour: "welcome",
    steps: [
      {
        icon: null,
        title: "Welcome to Umoja Inn! 👋",
        content:
          "This quick tour will show you around so you can confidently start bringing your style to life",
        showControls: true,
        showSkip: true,
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Create Your First Project",
        content:
          "Start by creating a project. Add your design brief, timeline, budget, and requirements.",
        selector: tourTarget("tour-buyer-create-project"),
        nextRoute: "/projects",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Manage Your Projects",
        content:
          "Manage active projects and job ads, review designer bids, manage drafts, and revisit completed work - all from one place.",
        selector: tourTarget("tour-sidebar-projects"),
        prevRoute: "/projects",
        nextRoute: "/sizing-templates",
      },
      // {
      //   ...WELCOME_TOUR_POINTER,
      //   icon: null,
      //   title: "Secure Project Payments",
      //   content:
      //     "Track milestone payments, escrow balances, and invoices. Funds remain securely held until you approve each completed milestone.",
      //   selector: tourTarget("tour-active-project-escrow"),
      //   side: "left",
      //   prevRoute: `/projects/${projectId}`,
      //   nextRoute: "/sizing-templates",
      // },
      // Uncomment when Designers nav is enabled in BUYERS_SIDEBAR_CONTENT:
      // {
      //   ...WELCOME_TOUR_POINTER,
      //   icon: null,
      //   title: "Browse Designers",
      //   content:
      //     "View designers you've previously worked with and create new projects with them!",
      //   selector: tourTarget("tour-sidebar-designers"),
      // },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Manage Sizing Templates",
        content:
          "Create, view, and manage your sizing templates here. Each template displays its current status so you always know if action is required.",
        selector: tourTarget("tour-sidebar-sizing-templates"),
        prevRoute: "/projects",
        nextRoute: "/escrow",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "View Escrow Details",
        content:
          "View active project escrows, and summary of released payments.",
        selector: tourTarget("tour-sidebar-escrow"),
        prevRoute: "/sizing-templates",
        nextRoute: "/settings",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Settings",
        content:
          "Manage your profile, security, and notification settings from one place.",
        selector: tourTarget("tour-sidebar-settings"),
        prevRoute: "/escrow",
        nextRoute: "/projects",
      },
      {
        ...APPBAR_TOUR_POINTER,
        icon: null,
        title: "Never Miss an Update",
        content:
          "Stay informed with real-time updates. To receive notifications on email or WhatsApp, update your notification settings.",
        selector: tourTarget("tour-appbar-notification"),
        prevRoute: "/settings",
      },
    ],
  };
};
