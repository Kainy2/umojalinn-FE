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

export const buildDesignerWelcomeTour = (isDesktop = true): Tour => {
  const appbarSide = isDesktop
    ? ("bottom-right" as const)
    : ("bottom" as const);

  return {
    tour: "welcome",
    steps: [
      {
        icon: null,
        selector: undefined,
        title: "Welcome to Umoja linn! 👋",
        content:
          "This quick tour will show you around so you can start managing your jobs with ease",
        showControls: true,
        showSkip: true,
      },

      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Dashboard",
        content:
          "Your Dashboard gives you an overview of your work. Here, you can view and manage your bids, active projects, completed jobs, and closed bids.",
        selector: tourTarget("tour-sidebar-dashboard"),
        nextRoute: "/jobs",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Share your work",
        content:
          "Showcase your designs and build your portfolio to attract more clients.",
        selector: tourTarget("tour-designer-share-work"),
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Jobs",
        content:
          "View available jobs and submit bids to clients to get started!",
        selector: tourTarget("tour-sidebar-jobs"),
        prevRoute: "/dashboard",
        nextRoute: "/sizing-templates",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Sizing Template",
        content:
          "View and manage your clients' sizing template. Each template's status is shown on the template card.",
        selector: tourTarget("tour-sidebar-sizing-templates"),
        prevRoute: "/jobs",
        nextRoute: "/wallet",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Wallet",
        content:
          "View your balance, transactions, and withdraw your earnings securely.",
        selector: tourTarget("tour-sidebar-wallet"),
        prevRoute: "/sizing-templates",
        nextRoute: "/escrow",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Escrow",
        content:
          "View active projects' escrow and summary of released payments",
        selector: tourTarget("tour-sidebar-escrow"),
        prevRoute: "/wallet",
        nextRoute: "/dashboard",
      },
      {
        icon: null,
        title: "Invite Client",
        content:
          "invite clients using their email or by sharing your personal invite link",
        selector: tourTarget("tour-appbar-invite-client"),
        side: appbarSide,
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 8,
        prevRoute: "/escrow",
      },
      {
        icon: null,
        title: "Help Centre",
        content:
          "Access guided tours, chat support, training webinars, and more whenever you need assistance.",
        selector: tourTarget("tour-appbar-help"),
        side: appbarSide,
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 8,
        nextRoute: "/settings",
      },
      {
        ...WELCOME_TOUR_POINTER,
        icon: null,
        title: "Settings",
        content:
          "Manage your profile, security, notification, and payment settings from one place.",
        selector: tourTarget("tour-sidebar-settings"),
        prevRoute: "/dashboard",
      },
    ],
  };
};

/** @deprecated Prefer buildDesignerWelcomeTour(isDesktop) for responsive sides. */
export const DESIGNER_WELCOME_TOUR = buildDesignerWelcomeTour(true);
