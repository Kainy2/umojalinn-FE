"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import CustomSwitch from "@/components/custom/Switch";
import { Separator } from "@/components/ui/separator";
import {
  useGetNotificationSettings,
  useUpdateNotificationSettings,
} from "@/tanstack/hooks/useUser";
import { NotificationSettingsProps } from "@/types/form";
import React from "react";

const NOTIFICATION_SETTINGS: Array<{
  title: string;
  description: string;
  inputs: Array<{
    label: string;
    prop: keyof NotificationSettingsProps;
  }>;
}> = [
  {
    title: "Tag",
    description:
      "These are notifications for when someone tags you in a project",
    inputs: [
      {
        label: "Push",
        prop: "tagPushNotifications",
      },
      {
        label: "Email",
        prop: "tagEmailNotifications",
      },
    ],
  },
  {
    title: "Reminders",
    description:
      "These are notifications to remind you of updates you might have missed.",
    inputs: [
      {
        label: "Push",
        prop: "reminderPushNotifications",
      },
      {
        label: "Email",
        prop: "reminderEmailNotifications",
      },
    ],
  },
  {
    title: "Product Updates",
    description: "These are notifications for Umoja linn products updates",
    inputs: [
      {
        label: "Push",
        prop: "productUpdates",
      },
      {
        label: "Email",
        prop: "productUpdatesEmail",
      },
    ],
  },
] as const;

const SettingsNotificationPage = () => {
  const { mutate: updateNotificationSettings } =
    useUpdateNotificationSettings();

  const { data: notificationSettings, isPending } =
    useGetNotificationSettings();

  return (
    <div className="flex flex-col gap-8">
      {NOTIFICATION_SETTINGS?.map((setting) => (
        <React.Fragment key={setting.title}>
          <FormItemWrapper
            title={setting.title}
            description={setting.description}
          >
            <div className="flex flex-col gap-4">
              {setting?.inputs?.map((input) => (
                <CustomSwitch
                  label={input?.label}
                  key={input?.prop}
                  disabled={isPending}
                  checked={notificationSettings?.data?.data?.[input?.prop]}
                  onCheckedChange={(check) =>
                    updateNotificationSettings({
                      [input?.prop]: check,
                    })
                  }
                />
              ))}
            </div>
          </FormItemWrapper>
          <Separator className="bg-border/50 " />
        </React.Fragment>
      ))}
    </div>
  );
};

export default SettingsNotificationPage;
