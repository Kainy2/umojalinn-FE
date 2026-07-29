import type { Tour } from "nextstepjs";

import type {
  TGuidedTourProfileType,
  TGuidedTourStep,
  TTourName,
  TTourStatus,
} from "@/constant/tour/@types";
import {
  CREATE_BID_TOUR_BID_ID_KEY,
  CREATE_BID_TOUR_PROJECT_ID_KEY,
} from "@/constant/tour/create-a-bid";
import { CREATE_PROJECT_TOUR_PROJECT_ID_KEY } from "@/constant/tour/create-a-project";
import { REVIEW_BID_TOUR_BID_ID_KEY } from "@/constant/tour/review-bid";
import { ACTIVE_PROJECTS_TOUR_PROJECT_ID_KEY } from "@/constant/tour/active-projects";
import {
  SIZING_TEMPLATE_TOUR_PROJECT_ID_KEY,
  SIZING_TEMPLATE_TOUR_TEMPLATE_ID_KEY,
} from "@/constant/tour/sizing-template";
import type { UmojaLinnSizingTemplate } from "@/types/project";

const BUYER_TOUR_STEPS: Partial<Record<TTourName, TGuidedTourStep>> = {
  welcome: "WELCOME",
  "create-a-project": "CREATE_PROJECT",
  "review-bid": "REVIEW_BID",
  "sizing-template": "MANAGE_SIZING_TEMPLATE",
  "active-projects": "MANAGE_ACTIVE_PROJECT",
};

const DESIGNER_TOUR_STEPS: Partial<Record<TTourName, TGuidedTourStep>> = {
  welcome: "WELCOME",
  "create-a-bid": "CREATE_BID",
  "sizing-template": "SIZING_TEMPLATE",
  "recommend-sizing-changes": "RECOMMENDED_CHANGES",
  wallet: "WALLET",
  "active-projects": "ACTIVE_PROJECT",
};

export const tourNameToGuidedTourStep = (
  tourId: TTourName,
  profileType: TGuidedTourProfileType,
): TGuidedTourStep | null => {
  const steps =
    profileType === "BUYER" ? BUYER_TOUR_STEPS : DESIGNER_TOUR_STEPS;
  return steps[tourId] ?? null;
};


export const pickBuyerSizingTemplate = (
  templates: UmojaLinnSizingTemplate[] | undefined,
) => {
  const editableTemplates = templates?.filter(
    (template) =>
      template.status !== "IN_USE" ||
      !template.projects?.some((project) => project.status === "LIVE"),
  );

  return (
    editableTemplates?.find((template) => template.status === "DRAFT") ??
    editableTemplates?.[0] ??
    null
  );
};

export type TTourState = Partial<Record<TTourName, TTourStatus>>;




import type { UmojaLinnUser } from "@/types/user";

export const getTourStatus = (
  tourId: TTourName,
  user?: UmojaLinnUser | null,
): TTourStatus | null => {
  if (user && user.role) {
    const roleKey = user.role.toLowerCase() as "buyer" | "designer";
    const stepEnum = tourNameToGuidedTourStep(tourId, user.role);
    if (stepEnum && user.guidedTourProgress?.[roleKey]?.[stepEnum]) {
      return "completed";
    }
    return null;
  }
  return null;
  // return readTourState()[tourId] ?? null;
};

let recentlyCompletedWelcomeTour = false;

export const setRecentlyCompletedWelcomeTour = (value: boolean) => {
  recentlyCompletedWelcomeTour = value;
};

export const hasRecentlyCompletedWelcomeTour = (): boolean =>
  recentlyCompletedWelcomeTour;

export const shouldAutoStartWelcomeTour = (user?: UmojaLinnUser | null): boolean =>
  !recentlyCompletedWelcomeTour && getTourStatus("welcome", user) === null;

export const shouldAutoStartCreateBidTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("create-a-bid", user) === null;

export const shouldAutoStartCreateProjectTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("create-a-project", user) === null;

export const shouldAutoStartReviewBidTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("review-bid", user) === null;

export const shouldAutoStartSizingTemplateTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("sizing-template", user) === null;

export const shouldAutoStartWalletTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("wallet", user) === null;

export const shouldAutoStartActiveProjectsTour = (user?: UmojaLinnUser | null): boolean =>
  getTourStatus("active-projects", user) === null;

export const isTourFinished = (tourId: TTourName, user?: UmojaLinnUser | null): boolean => {
  const status = getTourStatus(tourId, user);
  return status === "completed" || status === "skipped";
};

export const getCreateBidTourProjectId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(CREATE_BID_TOUR_PROJECT_ID_KEY);
};

export const setCreateBidTourProjectId = (projectId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CREATE_BID_TOUR_PROJECT_ID_KEY, projectId);
};

export const getCreateBidTourBidId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(CREATE_BID_TOUR_BID_ID_KEY);
};

export const setCreateBidTourBidId = (bidId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CREATE_BID_TOUR_BID_ID_KEY, bidId);
};

export const clearCreateBidTourSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CREATE_BID_TOUR_PROJECT_ID_KEY);
  window.sessionStorage.removeItem(CREATE_BID_TOUR_BID_ID_KEY);
};

export const getCreateProjectTourProjectId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(CREATE_PROJECT_TOUR_PROJECT_ID_KEY);
};

export const setCreateProjectTourProjectId = (projectId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CREATE_PROJECT_TOUR_PROJECT_ID_KEY, projectId);
};

export const clearCreateProjectTourSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CREATE_PROJECT_TOUR_PROJECT_ID_KEY);
};

export const getReviewBidTourBidId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(REVIEW_BID_TOUR_BID_ID_KEY);
};

export const setReviewBidTourBidId = (bidId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(REVIEW_BID_TOUR_BID_ID_KEY, bidId);
};

export const clearReviewBidTourSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(REVIEW_BID_TOUR_BID_ID_KEY);
};

export const getSizingTemplateTourTemplateId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(SIZING_TEMPLATE_TOUR_TEMPLATE_ID_KEY);
};

export const setSizingTemplateTourTemplateId = (templateId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    SIZING_TEMPLATE_TOUR_TEMPLATE_ID_KEY,
    templateId,
  );
};

export const getSizingTemplateTourProjectId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(SIZING_TEMPLATE_TOUR_PROJECT_ID_KEY);
};

export const setSizingTemplateTourProjectId = (projectId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SIZING_TEMPLATE_TOUR_PROJECT_ID_KEY, projectId);
};

export const clearSizingTemplateTourSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SIZING_TEMPLATE_TOUR_TEMPLATE_ID_KEY);
  window.sessionStorage.removeItem(SIZING_TEMPLATE_TOUR_PROJECT_ID_KEY);
};

export const getActiveProjectsTourProjectId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(ACTIVE_PROJECTS_TOUR_PROJECT_ID_KEY);
};

export const setActiveProjectsTourProjectId = (projectId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ACTIVE_PROJECTS_TOUR_PROJECT_ID_KEY, projectId);
};

export const clearActiveProjectsTourSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ACTIVE_PROJECTS_TOUR_PROJECT_ID_KEY);
};


export const TOUR_OPEN_INVITE_CLIENT_EVENT = "tour:open-invite-client";
export const TOUR_MOBILE_MENU_EVENT = "tour:mobile-menu";
export const TOUR_CREATE_BID_SAVE_MILESTONE_EVENT =
  "tour:create-bid-save-milestone";
export const TOUR_CREATE_BID_REQUEST_MEASUREMENTS_EVENT =
  "tour:create-bid-request-measurements";

export type TTourMobileMenuEventDetail = {
  open: boolean;
  /** When true, ignore outside-dismiss so Tour Next clicks don't close the drawer. */
  locked: boolean;
};

/** Matches Tailwind `md` — same breakpoint as `useIsMobile` / mobile hamburger. */
const TOUR_MOBILE_BREAKPOINT_PX = 768;

export const isTourMobileViewport = (): boolean =>
  typeof window !== "undefined" &&
  window.innerWidth < TOUR_MOBILE_BREAKPOINT_PX;

export const isSidebarTourSelector = (
  selector?: string | null,
): selector is string => {
  if (!selector) {
    return false;
  }

  return (
    selector.startsWith("#tour-sidebar-") ||
    selector === "#tour-designer-share-work" ||
    selector === "#tour-buyer-create-project"
  );
};

export const dispatchTourMobileMenuOpen = (open: boolean) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<TTourMobileMenuEventDetail>(TOUR_MOBILE_MENU_EVENT, {
      detail: { open, locked: open },
    }),
  );
};

export type TTourPersistEventDetail = {
  resolve: () => void;
};

const TOUR_PERSIST_FALLBACK_MS = 5000;

const dispatchAwaitableTourEvent = (eventName: string) => {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    let settled = false;
    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      resolve();
    };

    const timeout = window.setTimeout(settle, TOUR_PERSIST_FALLBACK_MS);

    window.dispatchEvent(
      new CustomEvent<TTourPersistEventDetail>(eventName, {
        detail: {
          resolve: () => {
            window.clearTimeout(timeout);
            settle();
          },
        },
      }),
    );
  });
};

export const dispatchOpenInviteClient = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(TOUR_OPEN_INVITE_CLIENT_EVENT));
};

export const dispatchCreateBidSaveMilestone = () =>
  dispatchAwaitableTourEvent(TOUR_CREATE_BID_SAVE_MILESTONE_EVENT);

export const dispatchCreateBidRequestMeasurements = () =>
  dispatchAwaitableTourEvent(TOUR_CREATE_BID_REQUEST_MEASUREMENTS_EVENT);

// Routed targets only mount after the destination page's data loads (route
// compile + fetch can far exceed 5s in dev), so give them a generous window.
const TOUR_SELECTOR_WAIT_MS = 30000;

let registeredTourSteps: Tour[] = [];

export const registerTourSteps = (tours: Tour[]) => {
  registeredTourSteps = tours;
};

export const getTourStepAt = (tourName: string | null, index: number) => {
  if (!tourName) {
    return undefined;
  }

  return registeredTourSteps.find((tour) => tour.tour === tourName)?.steps[
    index
  ];
};

const TOUR_POINTER_SYNC_MS = 2000;

/**
 * nextstepjs measures a step's target exactly once, when the step index
 * changes. On routed steps the destination page is often still mounting,
 * loading data, or animating at that moment, so the spotlight is computed
 * from a stale/missing rect and never corrected. nextstepjs does re-measure
 * the current target inside its window `resize` listener, so re-fire that
 * whenever the target's rect moves during a short settle window.
 *
 * ponytail: fixed 2s rAF window — shifts after that (very slow data further
 * up the page) are missed; upgrade to a MutationObserver-driven re-sync if
 * that ever shows up.
 */
export const syncTourPointerToTarget = (selector: string) => {
  void waitForTourSelector(selector).then((found) => {
    if (!found) {
      return;
    }

    const deadline = Date.now() + TOUR_POINTER_SYNC_MS;
    let lastRectKey = "";

    const tick = () => {
      // Re-query: the target can be remounted while the page settles.
      const element = document.querySelector(selector);

      if (element) {
        const rect = element.getBoundingClientRect();
        const rectKey = [rect.x, rect.y, rect.width, rect.height].join();

        if (rectKey !== lastRectKey) {
          lastRectKey = rectKey;
          window.dispatchEvent(new Event("resize"));
        }
      }

      if (Date.now() < deadline) {
        window.requestAnimationFrame(tick);
      }
    };

    // First tick on the next frame, after React has committed the step
    // change — a synchronous dispatch would make nextstepjs re-measure the
    // previous step's target instead.
    window.requestAnimationFrame(tick);
  });
};

/**
 * nextstepjs only advances routed steps via MutationObserver, so it misses
 * targets that already exist (e.g. sidebar). Check immediately, then observe.
 */
export const waitForTourSelector = (
  selector: string,
  timeoutMs = TOUR_SELECTOR_WAIT_MS,
): Promise<Element | null> => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const existing = document.querySelector(selector);
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = 0;

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        settle(element);
      }
    });

    const settle = (element: Element | null) => {
      if (settled) {
        return;
      }
      settled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      resolve(element);
    };

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Race: element may appear between the initial query and observe().
    const raced = document.querySelector(selector);
    if (raced) {
      settle(raced);
      return;
    }

    timeoutId = window.setTimeout(() => {
      settle(document.querySelector(selector));
    }, timeoutMs);
  });
};

/**
 * On mobile, sidebar tour targets only exist inside the hamburger Drawer.
 * Open it before waiting on those selectors; close it for appbar / page targets.
 */
export const ensureMobileMenuForTourSelector = async (
  selector?: string | null,
) => {
  if (!isTourMobileViewport()) {
    return;
  }

  if (isSidebarTourSelector(selector)) {
    dispatchTourMobileMenuOpen(true);
    await waitForTourSelector(selector);
    // Let the drawer finish sliding so getBoundingClientRect is stable.
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 200);
    });
    return;
  }

  dispatchTourMobileMenuOpen(false);
};
