export type TTourName =
  | "welcome"
  | "create-a-bid"
  | "create-a-project"
  | "review-bid"
  | "sizing-template"
  | "recommend-sizing-changes"
  | "wallet"
  | "active-projects";

export type TGuidedTourProfileType = "BUYER" | "DESIGNER";

export type TBuyerGuidedTourStep =
  | "WELCOME"
  | "CREATE_PROJECT"
  | "REVIEW_BID"
  | "MANAGE_SIZING_TEMPLATE"
  | "MANAGE_ACTIVE_PROJECT";

export type TDesignerGuidedTourStep =
  | "WELCOME"
  | "CREATE_BID"
  | "SIZING_TEMPLATE"
  | "RECOMMENDED_CHANGES"
  | "WALLET"
  | "ACTIVE_PROJECT";

export type TGuidedTourStep = TBuyerGuidedTourStep | TDesignerGuidedTourStep;

export type TCompleteGuidedTourBody = {
  profileType: TGuidedTourProfileType;
  step: TGuidedTourStep;
};

export type TTourTargetId =
  | "tour-sidebar-dashboard"
  | "tour-sidebar-projects"
  | "tour-sidebar-designers"
  | "tour-sidebar-jobs"
  | "tour-sidebar-sizing-templates"
  | "tour-sidebar-wallet"
  | "tour-sidebar-escrow"
  | "tour-sidebar-settings"
  | "tour-designer-share-work"
  | "tour-buyer-create-project"
  | "tour-create-project-description"
  | "tour-create-project-gallery"
  | "tour-create-project-budget"
  | "tour-create-project-review"
  | "tour-buyer-projects-tabs"
  | "tour-buyer-bids-tab"
  | "tour-review-bid-milestones"
  | "tour-review-bid-designer-note"
  | "tour-review-bid-sizing-template"
  | "tour-review-bid-project-details"
  | "tour-review-bid-delivery-milestone"
  | "tour-review-bid-budget"
  | "tour-review-bid-accept"
  | "tour-appbar-invite-client"
  | "tour-appbar-help"
  | "tour-appbar-notification"
  | "tour-create-bid-button"
  | "tour-create-bid-milestone-fields"
  | "tour-create-bid-milestone-payment"
  | "tour-create-bid-delivery-milestone"
  | "tour-create-bid-sizing-template"
  | "tour-create-bid-measurement-points"
  | "tour-create-bid-submit"
  | "tour-sizing-template-card"
  | "tour-sizing-template-measurement-points"
  | "tour-sizing-template-visual-reference"
  | "tour-buyer-sizing-template-actions"
  | "tour-recommend-changes-button"
  | "tour-recommend-measurement-point"
  | "tour-recommend-add-comment"
  | "tour-recommend-delete-comment"
  | "tour-recommend-submit"
  | "tour-wallet-balance"
  | "tour-wallet-link-account"
  | "tour-wallet-currency-carousel"
  | "tour-wallet-recent-transactions"
  | "tour-active-project-jobs-column"
  | "tour-active-project-milestone"
  | "tour-active-project-delivery-milestone"
  | "tour-active-project-card"
  | "tour-active-project-summary"
  | "tour-active-project-milestone-timeline"
  | "tour-active-project-fund"
  | "tour-active-project-milestone-approval"
  | "tour-active-project-escrow"
  | "tour-active-project-tabs"
  | "tour-active-project-sizing-template";

export type TTourStatus = "completed" | "skipped";
