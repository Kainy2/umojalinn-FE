"use client";

import React from "react";
import { UmojaLinnProject, UmojaLinnSizingTemplate } from "@/types/project";
import { Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Status types for buyers and designers
export type BuyerStatusType =
	| "ADD_REQUESTED_MEASUREMENTS"
	| "ADD_SIZING_TEMPLATE"
	| "CHANGES_RECOMMENDED"
	| null;

export type DesignerStatusType =
	| "REQUEST_SIZING_TEMPLATE"
	| "REQUEST_MEASUREMENT_POINTS"
	| "MEASUREMENT_REQUESTED"
	| "CHANGES_RECOMMENDED"
	| "UPDATED"
	| null;

type StatusConfig = {
	text: string;
	bgColor: string;
	borderColor: string;
	textColor: string;
	icon?: React.ReactNode;
};

// Buyer status configurations
const BUYER_STATUS_CONFIG: Record<NonNullable<BuyerStatusType>, StatusConfig> = {
	ADD_REQUESTED_MEASUREMENTS: {
		text: "Add Requested Measurements",
		bgColor: "bg-red-50",
		borderColor: "border-red-500",
		textColor: "text-red-600",
		icon: (
			<div className="bg-red-500 rounded-full p-0.5">
				<Plus className="size-3 text-white" />
			</div>
		),
	},
	ADD_SIZING_TEMPLATE: {
		text: "Add Sizing template",
		bgColor: "bg-yellow-50",
		borderColor: "border-yellow-500",
		textColor: "text-yellow-700",
		icon: (
			<div className="bg-yellow-500 rounded-full p-0.5">
				<Plus className="size-3 text-white" />
			</div>
		),
	},
	CHANGES_RECOMMENDED: {
		text: "Changes Recommended",
		bgColor: "bg-red-50",
		borderColor: "border-red-500",
		textColor: "text-red-600",
		icon: (
			<div className="bg-red-500 rounded-full p-0.5">
				<FileText className="size-3 text-white" />
			</div>
		),
	},

};

// Designer status configurations
const DESIGNER_STATUS_CONFIG: Record<
	NonNullable<DesignerStatusType>,
	StatusConfig
> = {
	REQUEST_SIZING_TEMPLATE: {
		text: "Request Sizing Template",
		bgColor: "bg-red-50",
		borderColor: "border-red-500",
		textColor: "text-red-600",
		icon: (
			<div className="bg-red-500 rounded-full p-0.5">
				<Plus className="size-3 text-white" />
			</div>
		),
	},
	REQUEST_MEASUREMENT_POINTS: {
		text: "Request Measurement Points",
		bgColor: "bg-red-50",
		borderColor: "border-red-500",
		textColor: "text-red-600",
		icon: (
			<div className="bg-red-500 rounded-full p-0.5">
				<Plus className="size-3 text-white" />
			</div>
		),
	},
	MEASUREMENT_REQUESTED: {
		text: "Measurement Requested",
		bgColor: "bg-gray-50",
		borderColor: "border-gray-400",
		textColor: "text-gray-600",
		icon: (
			<div className="bg-gray-400/30 rounded-full p-0.5">
				<Plus className="size-3 text-gray-600" />
			</div>
		),
	},
	CHANGES_RECOMMENDED: {
		text: "Changes Recommended",
		bgColor: "bg-gray-50",
		borderColor: "border-gray-400",
		textColor: "text-gray-600",
	},
	UPDATED: {
		text: "Updated",
		bgColor: "bg-red-50",
		borderColor: "border-red-500",
		textColor: "text-red-600",
	},
};

/**
 * Determines which status pill to show for a buyer based on template state
 */
export const getBuyerStatus = (
	template: UmojaLinnSizingTemplate
): BuyerStatusType => {
	const requestedMeasurementPoints =
		template?.requestedMeasurementPoints || [];
	const submittedMeasurementPoints =
		template?.submittedMeasurementPoints || [];
	const hasReviews =
		template?.metadata?.reviews &&
		!!Object.keys(template.metadata.reviews).length;
	const isProjectLive = template?.projects?.some((p) => p.status === "LIVE");


	// Priority 1: Designer has recommended changes
	if (hasReviews) {
		return "CHANGES_RECOMMENDED";
	}

	// Priority 2: Designer requested measurements but buyer hasn't submitted all
	if (
		isProjectLive && template?.status === "IN_USE" &&
		!!requestedMeasurementPoints.length &&
		!submittedMeasurementPoints.length
	) {
		return "ADD_REQUESTED_MEASUREMENTS";
	}


	// Priority 3: Template is draft or incomplete
	if (template?.status === "DRAFT") {
		return "ADD_SIZING_TEMPLATE";
	}

	return null;
};

/**
 * Determines which status pill to show for a designer based on template state
 */
export const getDesignerStatus = (
	template: UmojaLinnSizingTemplate,
): DesignerStatusType => {
	const requestedMeasurementPoints =
		template?.requestedMeasurementPoints || [];
	const submittedMeasurementPoints =
		template?.submittedMeasurementPoints || [];
	const hasDesignerRecommendations =
		template?.metadata?.reviews &&
		!!Object.keys(template.metadata.reviews).length;
	const hasRepliedRecommendations =
		!template?.metadata?.reviews ||
		Object.keys(template.metadata.reviews).length === 0;
	const isChangesUpdated = template?.isChangesUpdated;

	// Priority 1: Template is in use but no measurement points requested yet
	if (
		template?.status === "IN_USE" &&
		!requestedMeasurementPoints.length
	) {
		return "REQUEST_MEASUREMENT_POINTS";
	}

	// Priority 2: Measurement points requested but buyer hasn't submitted yet
	if (
		template?.status === "IN_USE" &&
		!!requestedMeasurementPoints.length &&
		!submittedMeasurementPoints.length
	) {
		return "MEASUREMENT_REQUESTED";
	}

	// Priority 3: Check for new updates or unanswered recommendations
	if (template?.status === "IN_USE") {
		if (hasRepliedRecommendations && isChangesUpdated) {
			return "UPDATED";
		}

		// Recommending changes if there are recommendations that haven't been replied to correctly
		if (hasDesignerRecommendations && !hasRepliedRecommendations) {
			return "CHANGES_RECOMMENDED";
		}
	}

	return null;
};

interface TemplateStatusPillProps {
	template: UmojaLinnSizingTemplate;
	isBuyer: boolean;
	getProjectUrl: () => string;
	inUse: boolean;
	projectInUse: UmojaLinnProject | undefined
}

/**
 * Status pill component for sizing template cards
 * Shows different status indicators based on user role (buyer/designer) and template state
 */
const TemplateStatusPill = ({ template, isBuyer, inUse, projectInUse }: TemplateStatusPillProps) => {

	const status = isBuyer
		? getBuyerStatus(template)
		: getDesignerStatus(template);

	// Instead of early returning null when status is null, we check if it's in use first.
	if (!status || !BUYER_STATUS_CONFIG[status as NonNullable<BuyerStatusType>] && !DESIGNER_STATUS_CONFIG[status as NonNullable<DesignerStatusType>]) {
		if (inUse && !!projectInUse) {
			return (
				<div
					className={cn(
						" top-3 left-3 z-10 w-full",
						"flex items-center justify-between gap-1.5 px-2.5 py-1.5",
						"rounded-full border-2 border-dashed",
						"bg-blue-50 border-blue-500 text-blue-600"
					)}
				>
					<span className="text-xs font-medium truncate">
						In Use
					</span>
				</div>
			);
		}
		return null;
	}

	const config = isBuyer
		? BUYER_STATUS_CONFIG[status as NonNullable<BuyerStatusType>]
		: DESIGNER_STATUS_CONFIG[status as NonNullable<DesignerStatusType>];

	return (
		<div
			className={cn(
				"top-3 left-3 z-10 w-full",
				"flex items-center justify-between gap-1.5 px-2.5 py-1.5",
				"rounded-full border-2 border-dashed",
				config.bgColor,
				config.borderColor,
				config.textColor
			)}
		>
			<span className="text-xs font-medium truncate">
				{config.text}
			</span>
			{config.icon && <span className="flex-shrink-0">{config.icon}</span>}
		</div>
	);
};

export default TemplateStatusPill;
