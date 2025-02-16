"use client";
import { categorizeDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { UmojaLinnChat } from "@/types/project";
import { formatDate } from "date-fns";
import { ImageIcon, User, X, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const ChatBubble = (props: UmojaLinnChat) => {
  const { user, createdAt, message, type, imageMeta, imageUrl, severity } =
    props;
  const { data: session } = useSession();
  const isMe = user?.id === session?.user?.id;
  if (!session?.user?.id) return;

  if (type === "NOTIFICATION") {
    return (
      <div
        className={cn(
          "bg-success text-white rounded-md py-2.5 px-4 flex items-center gap-2",
          severity === "ERROR" && "bg-error"
        )}
      >
        <span
          className={cn(
            "icon-wrapper",
            severity === "ERROR" ? "error" : "success"
          )}
        >
          {severity === "ERROR" ? <X /> : <Check />}
        </span>{" "}
        <span className="flex-1">{message}</span>
      </div>
    );
  }

  if (isMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] min-w-12">
          <div className="flex justify-between gap-4  text-foreground-body mb-1">
            <p className="font-semibold">You</p>
            <p>
              {categorizeDate(createdAt) === "Today"
                ? ""
                : formatDate(createdAt, "dd/MM/yy, ")}
              {formatDate(createdAt, "hh:mmaa")}
            </p>
          </div>
          {message && (
            <div
              className={cn(
                "bg-primary text-white rounded-md py-2.5 px-4 rounded-tr-none",
                imageUrl && "mb-4"
              )}
            >
              {message}
            </div>
          )}
          {imageUrl && (
            <a
              download
              href={imageUrl}
              className="w-full text-foreground-body border border-gray-200 rounded-md py-2.5 px-4 rounded-tr-none flex gap-4 items"
            >
              <span className="icon-wrapper primary ">
                <ImageIcon />
              </span>
              <span>
                <span className="font-semibold block">
                  {imageMeta?.fileName || "No filename"}
                </span>
                <span>{imageMeta?.fileSize || "Unknown size"}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      {user?.profilePhotoUri ? (
        <Image
          src={user?.profilePhotoUri}
          alt=""
          height={100}
          width={100}
          className="rounded-full shrink-0 object-cover size-14"
        />
      ) : (
        <div className="rounded-full shrink-0 bg-gray-100 size-14 flex items-center justify-center [&>svg]:size-8 text-foreground-body">
          <User />
        </div>
      )}
      <div className="w-full flex-1">
        <div className="flex justify-between gap-4 text-foreground-body mb-1">
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p>
            {categorizeDate(createdAt) === "Today"
              ? ""
              : formatDate(createdAt, "dd/MM/yy, ")}
            {formatDate(createdAt, "hh:mmaa")}
          </p>
        </div>
        {message && (
          <div
            className={cn(
              "bg-gray-100 text-foreground-body rounded-md py-2.5 px-4 rounded-tl-none",
              imageUrl && "mb-4"
            )}
          >
            {message}
          </div>
        )}
        {imageUrl && (
          <a
            download
            href={imageUrl}
            className="w-full text-foreground-body border border-gray-200 rounded-md py-2.5 px-4 rounded-tl-none flex gap-4 items"
          >
            <span className="icon-wrapper primary ">
              <ImageIcon />
            </span>
            <span>
              <span className="font-semibold block">
                {imageMeta?.fileName || "No filename"}
              </span>
              <span>{imageMeta?.fileSize || "Unknown size"}</span>
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
