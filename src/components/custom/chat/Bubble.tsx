"use client";

import { categorizeDate } from "@/lib/date";
import { cn, formatMessageWithLinks, isVideoLink, normaliseLink } from "@/lib/utils";
import { UmojaLinnChat } from "@/types/project";
import { formatDate } from "date-fns";
import { User, X, Check, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

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
              "text-black border rounded-md py-2.5 px-4 rounded-tr-none flex gap-2 whitespace-pre-wrap",
              imageUrl && "mb-4"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="text-green-500"><radialGradient id="a11" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="currentColor"></stop><stop offset=".3" stop-color="currentColor" stop-opacity=".9"></stop><stop offset=".6" stop-color="currentColor" stop-opacity=".6"></stop><stop offset=".8" stop-color="currentColor" stop-opacity=".3"></stop><stop offset="1" stop-color="currentColor" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a11)" stroke-width="25" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="currentColor" stroke-width="25" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>
            {message}
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
