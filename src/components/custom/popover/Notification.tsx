"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetNotifications } from "@/tanstack/hooks/useUser";
import { PopoverClose } from "@radix-ui/react-popover";
import { Bell, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import NotificationCard from "../card/Notification";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { UmojaLinnNotification } from "@/types/user";
import { uuidToBase62, uuidToBase62Safe } from "@/lib/uuid";

const NotificationPopover = () => {
  const { data: notificationData, isPending: loadingNotification } =
    useGetNotifications();
  const [open, setOpen] = useState(false);
  const unreadNotifications = useMemo(() => {
    return notificationData?.data?.data?.filter?.(
      (notification) => !notification?.isRead
    );
  }, [notificationData?.data?.data]);

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
                  <Skeleton key={index + _} className="h-14" />
                ))}
            {!loadingNotification && !unreadNotifications?.length && (
              <div className="flex items-center justify-center h-40 text-sm text-gray-500">
                <p>No unread Notifications</p>
              </div>
            )}
            <div className="flex flex-col">
              {unreadNotifications?.map((notification) => (
                <React.Fragment key={notification?.id}>
                  <PopoverClose asChild onClick={() => setOpen(false)}>
                    <NotificationCard
                      createdAt={notification?.createdAt}
                      id={notification?.id}
                      message={notification.message}
                      senderName={notification?.senderName}
                      isRead={notification?.isRead}
                      senderProfileUrl={notification?.senderProfileUrl}
                      metadata={notification?.metadata}
                    />
                  </PopoverClose>
                  <Separator className="bg-gray-200" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
