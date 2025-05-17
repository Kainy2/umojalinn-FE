"use client";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useGetInfiniteNotifications } from "@/tanstack/hooks/useUser";
import { PopoverClose } from "@radix-ui/react-popover";
import { Bell, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import NotificationCard from "../card/Notification";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const NotificationPopover = () => {
	const [open, setOpen] = useState(false);

	const {
		data: infiniteNotificationData,
		isPending: loadingNotification,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetInfiniteNotifications();

	const allNotifications = useMemo(() => 
		infiniteNotificationData?.pages?.map((page) => page.data.data).flat(), [infiniteNotificationData]
	);
	// const lastId = useMemo (() => infiniteNotificationData?.pages?.[infiniteNotificationData?.pages?.length - 1]?.data.lastId ?? "", [infiniteNotificationData]);

	const unreadNotifications = useMemo(() => {
		return allNotifications?.filter?.(
			(notification) => !notification?.isRead
		);
	}, [allNotifications]);

	const loadMore = () => {
		if (hasNextPage)
			fetchNextPage()
	};

	useEffect(() => {
		if (unreadNotifications?.length) {
			setOpen(true);
		}
	}, [unreadNotifications]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild onClick={() => setOpen(true)}>
				<Button variant="ghost" className="font-normal">
					<span className="relative">
						<Bell className="icon-base" />
						{!!unreadNotifications?.length && (
							<span className="size-2.5 bg-success absolute top-0 right-0 border border-white rounded-full" />
						)}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 relative">
				<PopoverClose asChild onClick={() => setOpen(false)}>
					<button className="absolute top-5 right-4 [&>svg]:size-5 text-foreground-body">
						<X />
					</button>
				</PopoverClose>
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-semibold mb-2 text-subtitle-2">
							Notifications
						</h4>
						{loadingNotification &&
							new Array(3)
								.fill("")
								.map((_, index) => (
									<Skeleton
										key={index + _}
										className="h-14"
									/>
								))}
						{!loadingNotification &&
							!allNotifications?.length && (
								<div className="flex items-center justify-center h-40 text-sm text-gray-500 transition">
									<p>No Notifications</p>
								</div>
							)}
						<div className="flex flex-col max-h-[70vh] overflow-scroll">
							{allNotifications?.map((notification) => (
								<React.Fragment key={notification?.id}>
									<PopoverClose
										asChild
										onClick={() => setOpen(false)}
									>
										<NotificationCard
											createdAt={notification?.createdAt}
											id={notification?.id}
											message={notification.message}
											senderName={
												notification?.senderName
											}
											isRead={notification?.isRead}
											senderProfileUrl={
												notification?.senderProfileUrl
											}
											metadata={notification?.metadata}
										/>
									</PopoverClose>
									<Separator className="bg-gray-200" />
								</React.Fragment>
							))}
							{hasNextPage && (
								<button
									onClick={loadMore}
									className="text-primary text-sm text-center block w-full mt-4 py-2 hover:text-primary/70 transition"
								>
									{isFetchingNextPage
										? "loading more..."
										: "Read more"}
								</button>
							)}
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default NotificationPopover;
