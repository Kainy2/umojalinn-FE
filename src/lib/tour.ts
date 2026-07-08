import type { TTourName, TTourStatus } from "@/constant/tour/@types";
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

const STORAGE_KEY = "umoja-designer-tours";

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

export const dispatchOpenInviteClient = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(TOUR_OPEN_INVITE_CLIENT_EVENT));
};
