import { Button, ButtonProps } from "@/components/ui/button";
import { useMarkNotificationAsRead } from "@/tanstack/hooks/useUser";
import Image from "next/image";
import React from "react";
import * as timeAgo from "timeago.js";
import NotificationMessage from "../NotificationMessage";
import { UmojaLinnNotification, UmojaLinnUserRole } from "@/types/user";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useSession } from "next-auth/react";

type NotificationCardProps = {
  id: string;
  senderProfileUrl?: string | null;
  senderName: string;
  createdAt: Date | string;
  isRead?: boolean;
  message: string;
  metadata?: UmojaLinnNotification["metadata"];
  onClick?: React.ComponentProps<"button">["onClick"];
};

const getActions = (
  metadata: UmojaLinnNotification["metadata"],
  role: UmojaLinnUserRole,
  message: UmojaLinnNotification["message"],
): ButtonProps[] | undefined => {
  const isMessage = message.includes("message");
  const keys = Object.keys(metadata || {});
  if (keys.includes("projectId")) {
    let projectHref: string;
    if (metadata?.bidId) {
      projectHref = `/bids/${uuidToBase62Safe(metadata?.bidId)}${
        role === "BUYER" ? "" : "/edit"
      }`;
    } else {
      switch (metadata?.projectStatus) {
        case "ADS":
          projectHref =
				role === 'BUYER'
					? `/ads/${uuidToBase62Safe(metadata?.projectId || '')}`
					: `/jobs/${uuidToBase62Safe(metadata?.projectId || '')}`;
          break;
        case "COMPLETED":
          projectHref = `/completed-jobs/${uuidToBase62Safe(
            metadata?.projectId || "",
          )}`;
          break;
        case "DRAFT":
          projectHref = `/drafts/${uuidToBase62Safe(
            metadata?.projectId || "",
          )}`;
          break;
        case "LIVE":
        default: {
          const projectPath = role === 'BUYER' ? 'projects' : 'active-jobs';
          const projectId = uuidToBase62Safe(metadata?.projectId || '');
          const chatSuffix = isMessage ? '/chat' : '';
        
          projectHref = `/${projectPath}/${projectId}${chatSuffix}`;
          break;
        }
      }
    }
    return [
		{
			children: metadata?.bidId
				? 'View Bid'
				: isMessage
          ? 'View Chat'
          : role !== 'BUYER'
            ? 'View Job'
            : 'View Project',
			href: projectHref,
			variant: 'outline',
		},
	];
  }
};

const NotificationCard = (props: NotificationCardProps) => {
  const {
    message,
    senderName,
    metadata,
    createdAt,
    isRead,
    senderProfileUrl,
    id,
    onClick,
  } = props;

  const { mutate: markNotificationRead } = useMarkNotificationAsRead();
  const { data: session } = useSession();

  return (
		<button
			className="flex flex-col gap-2 relative text-foreground-body p-2 py-3 transition hover:bg-gray-100"
			onClick={(e) => {
				onClick?.(e);
				markNotificationRead(id);
			}}
		>
			<div className="flex flex-col md:flex-row gap-2">
				{senderProfileUrl && (
					<Image
						alt=""
						className="size-12 rounded-full object-cover shrink-0"
						src={senderProfileUrl}
						height={48}
						width={48}
					/>
				)}
				<div className="text-left text-sm">
					<div className="flex gap-1 mb-1">
						<p className="font-semibold">{senderName}</p>
						<p>{timeAgo.format(new Date(createdAt))}</p>
					</div>
					<p>
						<NotificationMessage
              message={message || ""}
							content={metadata || {}}
							// options={{
							//   projectName: {
							//     className: "text-primary font-semibold",
							//   },
							// }}
						/>
					</p>
				</div>
			</div>
			<div className="flex gap-2 justify-end w-full">
				{!!session?.user?.profileRole &&
					!!metadata &&
					(metadata.buttonText || metadata.buttonUrl ? (
						<Button
							href={metadata.buttonUrl}
							variant="outline"
							size="sm"
						>
							{metadata.buttonText}
						</Button>
					) : (
						getActions(
							metadata,
							session.user.profileRole,
							message
						)?.map?.((button, index) => (
							<Button key={index} {...button} size="sm" />
						))
					))}
			</div>
			{!isRead && (
				<span className="size-2 bg-success absolute top-2 right-2 rounded-full" />
			)}
		</button>
  );
};

export default NotificationCard;
