"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";

type ProjectEditFooterProps = {
	leftButtonProps?: {
		hidden?: boolean;
		text?: string;
		onClick?: React.ComponentProps<"button">["onClick"];
		type?: React.ComponentProps<"button">["type"];
		disabled?: boolean;
	};
	rightPrimaryButtonProps?: {
		text?: string;
		onClick?: React.ComponentProps<"button">["onClick"];
		type?: React.ComponentProps<"button">["type"];
		disabled?: boolean;
	};
	rightSecondaryButtonProps?: {
		text?: string;
		onClick?: React.ComponentProps<"button">["onClick"];
		type?: React.ComponentProps<"button">["type"];
		disabled?: boolean;
	}
};

const ProjectEditFooter = ({
	leftButtonProps,
	rightPrimaryButtonProps,
	rightSecondaryButtonProps,
}: ProjectEditFooterProps) => {
	const router = useRouter();
	return (
		<div className="mt-6">
			<Separator className="bg-gray-200" />
			<div className="flex flex-col md:flex-row gap-2 mt-4">
					{!leftButtonProps?.hidden && (
						<Button
							disabled={leftButtonProps?.disabled}
							type={ leftButtonProps?.type || "button"}
							variant="ghost"
							onClick={(e) => {
								if(leftButtonProps?.onClick ){
									leftButtonProps.onClick(e);
								} else {
									router.back();
								}
							}}
						>
							{ leftButtonProps?.text || "Back"}
						</Button>
					)}
				<div className="flex-1 space-x-4" />
				{rightSecondaryButtonProps?.onClick && (
					<Button
						name="submit"
						value="save_and_submit"
						onClick={rightSecondaryButtonProps?.onClick}
						disabled={rightSecondaryButtonProps.disabled}
						type={ rightSecondaryButtonProps.type || "button"}
						variant="outline"
					>
						{rightSecondaryButtonProps.text || "Save & Exit"}
					</Button>
				)}

				{rightPrimaryButtonProps?.onClick && (
					<Button
					name="submit"
					value="save_and_continue"
					disabled={rightPrimaryButtonProps.disabled}
					type={ rightPrimaryButtonProps.type || "submit"}
					variant="default"
					onClick={rightPrimaryButtonProps.onClick}
				>
					{rightPrimaryButtonProps.text || "Continue"}
				</Button>
			)}
			</div>
		</div>
	);
};

export default ProjectEditFooter;
