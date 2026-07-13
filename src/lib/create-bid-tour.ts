import { createBid } from "@/actions/bid";
import { uuidToBase62Safe } from "@/lib/uuid";

export const createBidForTour = async (projectBase62Id: string) => {
  const response = await createBid(projectBase62Id);
  const bidId = response?.data?.data?.id;

  if (!bidId) {
    throw new Error("Unable to create bid for tour");
  }

  return uuidToBase62Safe(bidId);
};
