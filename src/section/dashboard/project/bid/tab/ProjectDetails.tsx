import LabelValue from "@/components/custom/LabelValue";
import { MOCK_BIDS } from "@/data/bid";
import { useParams } from "next/navigation";
import React from "react";

const BidTabProjectDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const bid = MOCK_BIDS.find((val) => val.id === id);

  return (
    <div className="flex flex-col gap-8">
      <p className="mb-2">{bid?.note}</p>
      <LabelValue label="Delivery location" value="Lagos, Nigeria" />
      <LabelValue label="Language" value={[["English", "Basic"]]} />
      <LabelValue label="Total jobs" value={"16 Jobs"} />
      <LabelValue label="Project deadline" value={"23 May, 2025"} />
      <LabelValue label="Yeas of Experience" value={"2 - 3 years"} />
      <LabelValue label="Clothing types" value={["Agbada", "Kaftan"]} />
      <LabelValue
        label="Aditional note"
        value={
          "I am a passionate fashion designer with [number] years of experience in the industry. My design aesthetic is a blend of classic elegance and contemporary flair, with an emphasis on creating pieces that are both beautiful and functional."
        }
      />
      <div>
        <h3 className="mb-2 font-semibold text-subtitle-2">
          Styling Inspirations
        </h3>
        <p className="text-sm mb-4 text-foreground-body">
          Snapshots of your works
        </p>
        <div className="bg-gray-100 aspect-square" />
      </div>
    </div>
  );
};

export default BidTabProjectDetailsSection;
