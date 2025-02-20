import Image from "next/image";
import React from "react";

const JobsHeader = () => {
  return (
    <div className="relative flex  flex-col lg:flex-row items-center h-60">
      <div className="relative h-32 lg:absolute lg:h-full w-full">
        <Image
          alt=""
          src="/img/webp/job-ad-header-lg.webp"
          className="hidden absolute lg:block object-cover object-left h-full w-full"
          fill
        />
        <Image
          alt=""
          src="/img/webp/job-ad-header-sm.webp"
          className="absolute lg:hidden object-cover object-center"
          fill
        />
      </div>
      <div className="relative container p-6 lg:p-12">
        <h1 className="text-lg mb-1 font-semibold max-w-xs">Job Post</h1>
        <p className="text-foreground-body max-w-xs">
          Explore all the job opportunities tailored for you.
        </p>
      </div>
    </div>
  );
};

export default JobsHeader;
