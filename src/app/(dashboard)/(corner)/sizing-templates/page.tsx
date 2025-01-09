import CreateSizingTemplateDialog from "@/components/custom/dialog/CreateSizingTemplate";
import Image from "next/image";
import React from "react";

const SizingTemplatesPage = () => {
  return (
    <div className="grid grid-cols-4">
      <CreateSizingTemplateDialog>
        <button className="relative h-52">
          <Image
            src="/img/webp/add-measurement.webp"
            alt=""
            className="absolute h-full w-full object-cover object-center"
            fill
          />
          <span className="absolute bottom-2 right-2 bg-primary-50 text-primary p-1 text-sm font-semibold rounded-full">
            x3
          </span>
        </button>
      </CreateSizingTemplateDialog>
    </div>
  );
};

export default SizingTemplatesPage;
