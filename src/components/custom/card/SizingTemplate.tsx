"use client";
import { UmojaLinnSizingTemplate } from "@/types/project";
import React, { useState } from "react";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import Image from "next/image";
// import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Eye, Loader2, Trash2 } from "lucide-react";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useDeleteSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TemplateStatusPill from "@/components/sizing-template/TemplateStatusPill";

const SizingTemplateCard = (props: { template: UmojaLinnSizingTemplate }) => {
	const { template } = props;
	const { data: session } = useSession();

	const isBuyer = session?.user?.profileRole === "BUYER";

	const inUse = template?.status === "IN_USE";
	const isDraft = template?.status === "DRAFT";
	const projectInUse = template?.projects?.find(
		(project) => project?.status !== "COMPLETED"
	);

	// Delete confirmation modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Delete mutation
	const { mutate: deleteSizingTemplate, isPending: isDeleting } = useDeleteSizingTemplate({
		onSuccess: () => {
			setShowDeleteModal(false);
		},
	});

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		deleteSizingTemplate(template.id);
	};

	const getProjectUrl = () => {
		let projectHref: string;
		const role = session?.user.profileRole;
		const projectId = projectInUse?.id;

		switch (projectInUse?.status) {
			case "ADS":
				projectHref =
					role === "BUYER"
						? `/ads/${uuidToBase62Safe(projectId || "")}`
						: `/jobs/${uuidToBase62Safe(projectId || "")}`;
				break;
			case "COMPLETED":
				projectHref = `/completed-jobs/${uuidToBase62Safe(
					projectId || ""
				)}`;
				break;
			case "DRAFT":
				projectHref = `/drafts/${uuidToBase62Safe(projectId || "")}`;
				break;
			case "LIVE":
			default: {
				const projectPath = role === "BUYER" ? "projects" : "active-jobs";
				const newProjectId = uuidToBase62Safe(projectId || "");

				projectHref = `/${projectPath}/${newProjectId}`;
				break;
			}
		}

		return projectHref;
	};

	return (
		<>
			<SizingTemplateDialog id={template?.id}>
				<button className="flex flex-col p-2 border  border-gray-200 gap-2 rounded-[16px]  text-left bg-white transition-shadow  group relative w-full lg:w-[300px]">
					{/* Top Image Section */}
					<div className="relative h-52 w-full border border-gray-200 rounded-[8px] overflow-hidden bg-[#f8f9fa] shrink-0">
						<Image
							// src={
							// 	isBuyer
							// 		? "/img/webp/sizing-template-card.webp"
							// 		: "/img/webp/sizing-template-designer-card.webp"
							// }
							src="/img/png/buy-template.png"

							alt=""
							className="object-cover object-center"
							fill
						/>

						{/* Status Pill */}
						<div className="absolute top-3 left-3 z-10">
							<TemplateStatusPill
								template={template}
								isBuyer={isBuyer}
								getProjectUrl={getProjectUrl}
								inUse={inUse}
								projectInUse={projectInUse}
							/>
						</div>

						{/* Delete button for draft templates (buyer only) */}
						{isBuyer && isDraft && (
							<div
								onClick={handleDeleteClick}
								className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-20"
								title="Delete template"
							>
								<Trash2 className="size-4" />
							</div>
						)}
					</div>

					{/* Bottom Info Section */}
					<div className="flex gap-3 items-center  w-full mt-1 px-1 pb-1">
						<Image
							alt="Profile"
							src={
								template?.buyer?.user?.profilePhotoUri ||
								session?.user?.profilePhotoUri ||

								"/img/webp/user.webp"
							}
							height={36}
							width={36}
							className="object-cover object-center rounded-full shrink-0 size-9"
						/>
						<div className="flex flex-col flex-1 min-w-0">
							<h2
								title={template?.name}
								className="text-sm font-semibold truncate text-[#374151]"
							>
								{template?.name}
							</h2>
							<p className="text-[13px] text-[#4B5563] truncate w-full">
								{projectInUse?.title || "My Agbada"}
							</p>
						</div>
						{!isBuyer && (
							<div className="w-fit bg-primary-50 text-primary p-1.5 rounded-full aspect-square shrink-0">
								<Eye className="size-4" />
							</div>
						)}
					</div>
				</button>
			</SizingTemplateDialog>

			{/* Delete Confirmation Modal */}
			<Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Delete Sizing Template</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &quot;{template?.name}&quot;? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setShowDeleteModal(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDelete}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<Loader2 className="size-4 animate-spin mr-2" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SizingTemplateCard;
