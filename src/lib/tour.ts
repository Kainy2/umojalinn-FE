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

const STORAGE_KEY = "umoja-designer-tours";

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

type TTourState = Partial<Record<TTourName, TTourStatus>>;

const readTourState = (): TTourState => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as TTourState;
  } catch {
    return {};
  }
};

const writeTourState = (state: TTourState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getTourStatus = (tourId: TTourName): TTourStatus | null =>
  readTourState()[tourId] ?? null;

export const setTourStatus = (tourId: TTourName, status: TTourStatus) => {
  writeTourState({
    ...readTourState(),
    [tourId]: status,
  });
};

export const shouldAutoStartWelcomeTour = (): boolean =>
  getTourStatus("welcome") === null;

export const shouldAutoStartCreateBidTour = (): boolean =>
  getTourStatus("create-a-bid") === null;

export const shouldAutoStartCreateProjectTour = (): boolean =>
  getTourStatus("create-a-project") === null;

export const shouldAutoStartReviewBidTour = (): boolean =>
  getTourStatus("review-bid") === null;

export const shouldAutoStartSizingTemplateTour = (): boolean =>
  getTourStatus("sizing-template") === null;

export const shouldAutoStartWalletTour = (): boolean =>
  getTourStatus("wallet") === null;

export const shouldAutoStartActiveProjectsTour = (): boolean =>
  getTourStatus("active-projects") === null;

export const isTourFinished = (tourId: TTourName): boolean => {
  const status = getTourStatus(tourId);
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

export const resetTourStatus = (tourId: TTourName) => {
  const state = readTourState();
  delete state[tourId];
  writeTourState(state);
};

export const TOUR_OPEN_INVITE_CLIENT_EVENT = "tour:open-invite-client";
export const TOUR_CREATE_BID_SAVE_MILESTONE_EVENT =
  "tour:create-bid-save-milestone";
export const TOUR_CREATE_BID_REQUEST_MEASUREMENTS_EVENT =
  "tour:create-bid-request-measurements";

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
