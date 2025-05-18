"use client";
import { UmojaLinnSizingTemplate } from "@/types/project";
import React from "react";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { uuidToBase62Safe } from "@/lib/uuid";

const SizingTemplateCard = (props: { template: UmojaLinnSizingTemplate }) => {
	const { template } = props;
	const { data: session } = useSession();

	const isBuyer = session?.user?.profileRole === "BUYER";

	const inUse = template?.status === "IN_USE";
	const isDraft = template?.status === "DRAFT";
	const projectInUse = template?.projects?.find(
		(project) => project?.status !== "COMPLETED"
	);
	// console.log({inUse, projectInUse, template });


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
		<SizingTemplateDialog
			id={template?.id}
			type={isDraft ? "DRAFT-EDIT" : undefined}
		>
			<button className="relative h-52">
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
				{inUse && !!projectInUse && (
					<Link
            onClick={e=> e.stopPropagation()}
            href={getProjectUrl()}
            className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full text-sm max-w-[50%] truncate text-white"
           >
						{projectInUse?.title}
					</Link>
				)}
			</button>
		</SizingTemplateDialog>
	);
};

export default SizingTemplateCard;
