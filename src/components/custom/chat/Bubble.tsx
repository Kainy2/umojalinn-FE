"use client";

import { categorizeDate } from "@/lib/date";
import { cn, formatMessageWithLinks, isVideoLink, normaliseLink } from "@/lib/utils";
import { UmojaLinnChat } from "@/types/project";
import { formatDate } from "date-fns";
import { User, X, Check, Link2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ChatBubble = (props: UmojaLinnChat) => {
  const { user, createdAt, message: rawMessage, type, imageMeta, imageUrl, severity } =
    props;
  const { data: session } = useSession();
  const isMe = user?.id === session?.user?.id;

  const { message, urlCount } = formatMessageWithLinks(rawMessage ?? "");
  const isOnlyUrl = urlCount === 1 && rawMessage?.split(" ").length === 1;
  const isUploading = rawMessage?.toLowerCase().includes("file uploading");

  const isVideo = isVideoLink(imageUrl || "");
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

  if (type === "CALL_JOIN") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {user?.profilePhotoUri ? (
            <Image
              src={user?.profilePhotoUri}
              alt=""
              height={40}
              width={40}
              className="rounded-full shrink-0 object-cover size-10"
            />
          ) : (
            <div className="rounded-full shrink-0 bg-blue-100 size-10 flex items-center justify-center [&>svg]:size-5 text-blue-600">
              <User />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-blue-900">
              {user?.firstName} {user?.lastName} joined the call
            </p>
            <p className="text-xs text-blue-600">
              {categorizeDate(createdAt) === "Today" ? "" : formatDate(createdAt, "dd/MM/yy, ")}
              {formatDate(createdAt, "hh:mmaa")}
            </p>
          </div>
        </div>
        <Link href={`/video/${message}`}>
          <Button
            className="w-full"
            size="sm"
            disabled={session?.user?.id && message ? undefined : true}
          >
            Join Call
          </Button>
        </Link>
      </div>
    );
  }


  if (isMe) {
    return isUploading ? (<div className="flex justify-end ">
      <div className=" max-w-[70%] min-w-12">
        <div className="flex justify-between gap-4 items-end text-foreground-body mb-1">
          <p className="font-semibold">You</p>
          <p className="text-xs font-medium italic mb-0.5 text-end">
            {categorizeDate(createdAt) === "Today"
              ? ""
              : formatDate(createdAt, "dd/MM/yy, ")}
            {formatDate(createdAt, "hh:mmaa")}
          </p>
        </div>
        {message && (
          <div
            className={cn(
              "text-black border rounded-md py-2.5 px-4 rounded-tr-none flex gap-2 whitespace-pre-wrap items-center",
              imageUrl && "mb-4"
            )}
          >
            <Loader2 className="w-4 h-4 animate-spin text-green-500 shrink-0" />
            <span>
              {message}

            </span>
          </div>
        )}

      </div>
    </div>) : imageUrl || !isOnlyUrl ? (
      <div className="flex justify-end ">
        <div className=" max-w-[70%] min-w-12">
          <div className="flex justify-between gap-4 items-end text-foreground-body mb-1">
            <p className="font-semibold">You</p>
            <p className="text-xs font-medium italic mb-0.5 text-end">
              {categorizeDate(createdAt) === "Today"
                ? ""
                : formatDate(createdAt, "dd/MM/yy, ")}
              {formatDate(createdAt, "hh:mmaa")}
            </p>
          </div>
          {message && (
            <div
              className={cn(
                "bg-primary text-white rounded-md py-2.5 px-4 rounded-tr-none whitespace-pre-wrap",
                imageUrl && "mb-4"
              )}
            >
              {message}
            </div>
          )}
          {imageUrl && (
            <a
              download
              target='_blank'
              rel="noopener noreferrer"
              href={imageUrl}
              className="w-full text-foreground-body border border-gray-200 rounded-md py-2.5 pr-4 rounded-tr-none flex gap-4 items"
            >
              <span className="icon-wrapper primary ">
                {isVideo ? (
                  <video
                    src={imageUrl}
                    className="rounded-lg shrink-0 object-cover size-8"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt=""
                    height={100}
                    width={100}
                    className="rounded-lg shrink-0 object-cover size-8"
                  />
                )}
              </span>
              <span>
                <span className="font-semibold block">
                  {/* {imageMeta?.fileName || "No filename"} */}
                  {isVideo ? "Video" : "Image"}
                </span>
                <span>{imageMeta?.fileSize || "Unknown size"}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    ) : (
      <a target='_blank' rel="noopener noreferrer" href={normaliseLink(rawMessage)} className="text-foreground-body rounded-md gap-4 my-2 self-end max-w-[70%] min-w-12">
        <div className="flex justify-between gap-4 items-end text-foreground-body mb-1">
          <p className="font-semibold">You</p>
          <p className="text-xs font-medium italic mb-0.5 text-end">
            {categorizeDate(createdAt) === "Today"
              ? ""
              : formatDate(createdAt, "dd/MM/yy, ")}
            {formatDate(createdAt, "hh:mmaa")}
          </p>
        </div>
        <div
          className={" flex gap-2  items-center border border-border/20 bg-slate-50"}
        >
          <span className="icon-wrapper warning">
            <Link2 />
          </span>
          <p className="whitespace-pre-wrap min-w-0">{rawMessage}</p>
        </div>
      </a>
    )
  }


  // Received message
  return imageUrl || !isOnlyUrl ? (
    <div className="flex gap-4 items-start w-fit min-w-12 max-w-[70%]">
      {user?.profilePhotoUri ? (
        <Image
          src={user?.profilePhotoUri}
          alt=""
          height={100}
          width={100}
          className="rounded-full shrink-0 object-cover size-8"
        />
      ) : (
        <div className="rounded-full shrink-0 bg-gray-100 size-8 flex items-center justify-center [&>svg]:size-5 text-foreground-body">
          <User />
        </div>
      )}
      <div className="w-full flex-1">
        <div className="flex justify-between gap-4 items-end text-foreground-body mb-1">
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs font-medium italic mb-0.5 text-end">
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
            target="_blank"
            rel="noopener noreferrer"
            href={imageUrl}
            className="w-full text-foreground-body border border-gray-200 rounded-md py-2.5 px-4 rounded-tl-none flex gap-4 items"
          >
            <span className="icon-wrapper primary ">
              {isVideo ? (
                <video
                  src={imageUrl}
                  className="rounded-lg shrink-0 object-cover size-8"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt=""
                  height={100}
                  width={100}
                  className="rounded-lg shrink-0 object-cover size-8"
                />
              )}
            </span>
            <span>
              <span className="font-semibold block">
                {/* {imageMeta?.fileName || "No filename"} */}
                {isVideo ? "Video" : "Image"}
              </span>
              <span>{imageMeta?.fileSize || "Unknown size"}</span>
            </span>
          </a>
        )}
      </div>
    </div>
  ) : (
    <div className="flex rounded-md max-w-[70%] min-w-16 my-2 gap-4 self-start">
      {user?.profilePhotoUri ? (
        <Image
          src={user?.profilePhotoUri}
          alt=""
          height={50}
          width={50}
          className="rounded-full shrink-0 object-cover size-8"
        />
      ) : (
        <div className="rounded-full shrink-0 bg-gray-100 size-8 flex items-center justify-center [&>svg]:size-5 text-foreground-body">
          <User />
        </div>
      )}

      <a target='_blank' rel="noopener noreferrer" href={normaliseLink(rawMessage)} className="flex-1 w-full rounded-md text-foreground-body gap-4 my-2 self-start justify-end ">
        <div className="flex justify-between gap-4  text-foreground-body mb-1">
          <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs font-medium italic mb-0.5 text-end">
            {categorizeDate(createdAt) === "Today"
              ? ""
              : formatDate(createdAt, "dd/MM/yy, ")}
            {formatDate(createdAt, "hh:mmaa")}
          </p>
        </div>
        <div
          // href={messageUrl}
          // download={value?.type === "media"}
          // target="_blank"
          className={" flex gap-2 items-center border border-border/20 bg-slate-50"}
        >
          <span className="icon-wrapper warning">
            <Link2 />
          </span>
          <p className="whitespace-pre-wrap min-w-0">{rawMessage}</p>
        </div>
      </a>
    </div>
  )
};

export default ChatBubble;
