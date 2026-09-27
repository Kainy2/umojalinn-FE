import type { TTourTargetId } from "@/constant/tour/@types";

export type TCreateProjectTourTargetId = Extract<
  TTourTargetId,
  | "tour-create-project-description"
  | "tour-create-project-gallery"
  | "tour-create-project-budget"
  | "tour-create-project-review"
  | "tour-buyer-projects-tabs"
>;

export const CREATE_PROJECT_TOUR_PROJECT_ID_KEY =
  "umoja-create-project-tour-project-id";

const tourTarget = (id: TCreateProjectTourTargetId) => `#${id}`;

const CREATE_PROJECT_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildCreateProjectTour = (projectId: string) => {
  const descriptionPath = `/project/${projectId}`;
  const galleryPath = `/project/${projectId}/gallery`;
  const budgetPath = `/project/${projectId}/requirements-and-budget`;
  const reviewPath = `/project/${projectId}/review`;
  const projectsPath = "/projects";

  return {
    tour: "create-a-project" as const,
    steps: [
      {
        ...CREATE_PROJECT_POINTER,
        icon: null,
        title: "Let's walk you through creating your first outfit!",
        content:
          "Start by describing your dream outfit - title, details, and any special notes!",
        selector: tourTarget("tour-create-project-description"),
        side: "top" as const,
        nextRoute: galleryPath,
      },
      {
        ...CREATE_PROJECT_POINTER,
        icon: null,
        title: "Project Gallery",
        content:
          "This is the fun part! Upload images or sketches to help your designer bring your style to life.",
        selector: tourTarget("tour-create-project-gallery"),
        side: "bottom" as const,
        prevRoute: descriptionPath,
        nextRoute: budgetPath,
      },
      {
        ...CREATE_PROJECT_POINTER,
        icon: null,
        title: "Budget",
        content: "Set a budget for your outfit - in your preferred currency!",
        selector: tourTarget("tour-create-project-budget"),
        side: "right" as const,
        prevRoute: galleryPath,
        nextRoute: reviewPath,
      },
      {
        ...CREATE_PROJECT_POINTER,
        icon: null,
        title: "Confirm details",
        content:
          "Now review everything and post your project. A designer will be in touch with a bid!",
        selector: tourTarget("tour-create-project-review"),
        side: "top" as const,
        prevRoute: budgetPath,
        nextRoute: projectsPath,
      },
      {
        ...CREATE_PROJECT_POINTER,
        icon: null,
        title: "You're Set! 🎉",
        content:
          "Find your posted job ads under Ads, review designer bids under Bids, continue working on saved drafts under Drafts, and view completed projects under Completed.",
        selector: tourTarget("tour-buyer-projects-tabs"),
        side: "bottom" as const,
        prevRoute: reviewPath,
      },
    ],
  };
};
