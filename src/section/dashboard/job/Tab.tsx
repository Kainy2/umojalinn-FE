import CustomTab from "@/components/custom/tab";
import React from "react";

const JobsTab = () => {
  return (
    <CustomTab
      active={"Private Jobs"}
      type="NAVIGATOR"
      tabs={[
        {
          title: "Private Jobs",
          href: "/jobs",
        },
      ]}
    />
  );
};

export default JobsTab;
