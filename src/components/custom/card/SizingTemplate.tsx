"use client";
import { UmojaLinnSizingTemplate } from "@/types/project";
import React, { useState } from "react";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Eye, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
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
				<button className="relative h-52 group">
					<Image
						src={
							isBuyer
								? "/img/webp/sizing-template-card.webp"
								: "/img/webp/sizing-template-designer-card.webp"
						}
						alt=""
						className="absolute object-center object-cover"
						fill
					/>
					<div
						className={cn(
							"absolute bottom-0 p-4 backdrop-blur-md bg-white/30 border-t-1 border-white/50 w-full",
							isBuyer &&
								inUse &&
								"h-full border-none flex flex-col items-center justify-center "
						)}
					>
						{isBuyer ? (
							<>
								<h2 className="text-subtitle-2 font-bold text-center truncate w-full">
									{template?.name}
								</h2>
								{(inUse || isDraft) && (
									<p className="text-primary font-semibold">
										{isDraft ? "Draft" : "In use"}
									</p>
								)}
							</>
						) : (
							<div className="flex gap-2 text-left items-center w-full justify-between">
								<div className="w-fit">
									<Image
										alt=""
										src={
											template?.buyer?.user?.profilePhotoUri ||
											"/img/webp/user.webp"
										}
										height={150}
										width={150}
										className="object-cover object-center rounded-full aspect-square shrink-0 size-12"
									/>
								</div>

								<div className="flex flex-col gap-1 flex-1 min-w-0">
									<h2
										title={template?.name}
										className="text-subtitle-2 font-bold truncate "
									>
										{template?.name}
									</h2>
									{projectInUse?.title && (
										<p className="text-foreground-body text-sm truncate w-full">
											{projectInUse?.title}
										</p>
									)}
								</div>
								<div className="w-fit bg-primary-50 text-primary p-1.5 rounded-full aspect-square shrink-0">
									<Eye />
								</div>
							</div>
						)}
					</div>

					{/* Delete button for draft templates (buyer only) */}
					{isBuyer && isDraft && (
						<button
							onClick={handleDeleteClick}
							className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
							title="Delete template"
						>
							<Trash2 className="size-4" />
						</button>
					)}

					{inUse && !!projectInUse && (
						<Link
							onClick={(e) => e.stopPropagation()}
							href={getProjectUrl()}
							className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full text-sm max-w-[50%] truncate text-white"
						>
							{projectInUse?.title}
						</Link>
					)}
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
