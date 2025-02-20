import CheckCircle from "@/icons/CheckCircle";
import { cn, formatFileSize } from "@/lib/utils";
import { File, Trash } from "lucide-react";
import React from "react";

type FilePreviewProps = {
  file: File;
  progress?: number;
  showFilename?: boolean;
  onDelete?: () => void;
};

const FilePreview = (props: FilePreviewProps) => {
  return (
    <div className="border-2 border-primary flex gap-4 p-6 rounded-md">
      <span className="icon-wrapper primary">
        <File />
      </span>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <p className="font-semibold mb-1 truncate">
              {props.showFilename ? props?.file?.name : "Transaction Receipt"}
            </p>
            <p>{formatFileSize(props.file)}</p>
          </div>

          {props.onDelete ? (
            <button className="text-primary" onClick={props.onDelete}>
              <Trash />
            </button>
          ) : (
            <CheckCircle className="text-primary" />
          )}
        </div>
        <div
          className={cn(
            "flex gap-1 items-center",
            props.progress === undefined && "hidden"
          )}
        >
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <span
              className="h-full block bg-primary"
              style={{
                width: `${(props.progress || 0) * 100}%`,
              }}
            />
          </div>
          <p>{Math.round((props.progress || 0) * 100)}%</p>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
