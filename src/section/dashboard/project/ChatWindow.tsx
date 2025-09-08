"use client";
import { cn, fileToPreviewUrl } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import ChatTimeDivider from "@/components/custom/chat/TimeDivider";
import { categorizeDate } from "@/lib/date";
import { UmojaLinnChat } from "@/types/project";
import ChatBubble from "@/components/custom/chat/Bubble";
import { ImageIcon, X } from "lucide-react";
import useFilePicker, { useFileSizeError } from "@/hooks/useFilePicker";
import Image from "next/image";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD } from "@/constant";
import { useChat } from "@/hooks/use-chat";

type ChatWindowProps = {
  projectId: string;
  className?: React.ComponentProps<"div">["className"];
};

const ChatWindow = (props: ChatWindowProps) => {
  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD);
  const { Input, onClick: handleFilePick } = useFilePicker({
    onSelect: (file: File | FileList | null) => {
      let files = images;
      if (file && !isFileSizeValid(file)) return;
      if (file instanceof FileList) {
        for (const f of file) {
          files = [...files, f];
        }
      } else if (file instanceof File) {
        files = [...files, file];
      }
      setPreviewMedia(
        files
          .map((file) => ({
            type: file.type,
            url: fileToPreviewUrl(file) ?? ''
          }))
          .filter((media) => media.url !== null),
      );
      setImages(files);
    },
    accept: "image/*,video/*",
    multiple: true,
  });

  const bottomDiv = useRef<HTMLDivElement | null>(null);
  const {
		data,
		handleSend,
		loading,
		message,
		setMessage,
		previewMedia,
		setPreviewMedia,
		images,
		setImages,
  } = useChat(props.projectId);

  useEffect(() => {
    if (data?.length && bottomDiv?.current) {
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);


  return (
    <div
      className={cn(
        "min-h-[50vh] max-h-[60vh] md:max-h-[80vh] overflow-scroll flex-1 flex flex-col",
        props.className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 break-words">
        {data?.map((d: UmojaLinnChat, i) => {
          return (
            <React.Fragment key={i}>
              {(i === 0 ||
                categorizeDate(data[i - 1]?.createdAt) !==
                  categorizeDate(d?.createdAt)) && (
                <ChatTimeDivider date={d?.createdAt} />
              )}
              <ChatBubble {...d} />
            </React.Fragment>
          );
        })}
        {(!data?.length ||
          (!!data[data.length - 1]?.createdAt &&
            categorizeDate(data[data.length - 1]?.createdAt) !== "Today")) && (
          <ChatTimeDivider date={new Date()} />
        )}
        <div ref={bottomDiv} />
      </div>
      <div className="border border-border p-3 ring-transparent focus-within:ring-primary">
        <textarea
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          placeholder="Send a message"
          className="w-full md:hidden resize-none mb-4 focus-visible:ring-transparent focus-visible:outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          placeholder="Send a message"
          className="w-full hidden md:block resize-none mb-4 focus-visible:ring-transparent focus-visible:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent newline
              if (message.trim()) {
                handleSend(); // Send message
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-4">
          {previewMedia.map(({type, url:previewUrl}, i) => {
            if (!previewUrl) return null
            return (
              <span className="relative" key={previewUrl + i}>
                {type.includes("video") ? (
                  <video
                    // autoPlay
                    // muted
                    height={50}
                    width={50}
                    src={previewUrl}
                    className="size-14 object-cover rounded" />
                ) : (
                  <Image
                    height={50}
                    width={50}
                    src={previewUrl}
                    alt="upload preview"
                    className="size-14 object-cover rounded" />
                )}
                <button
                  onClick={() => {
                    setPreviewMedia((prev) => prev.filter((_, index) => index !== i)
                    );
                    setImages((prev) => prev.filter((_, index) => index !== i));
                  } }
                  className="flex items-center justify-center size-5 [&>svg]:size-3 text-white bg-error absolute -top-2.5 -right-2.5 rounded-full"
                >
                  <X />
                </button>
              </span>
            );
          })}
        </div>

        <div className="flex gap-4 justify-end items-center">
          <button
            onClick={handleFilePick}
            className="[&>svg]:size-5 text-foreground-body "
          >
            <ImageIcon />
          </button>
          <Input />
          <Button onClick={handleSend} loading={loading} disabled={(!message && !images.length)}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
