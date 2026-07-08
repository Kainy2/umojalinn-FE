"use client";

import { useEffect } from "react";

import {
  TOUR_PAGE_READY_EVENT,
  type ITourReadyMarkerProps,
} from "@/components/tour/TourReadyMarker/@types";

const TourReadyMarker = ({ ready }: ITourReadyMarkerProps) => {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(TOUR_PAGE_READY_EVENT, { detail: { ready } }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent(TOUR_PAGE_READY_EVENT, { detail: { ready: false } }),
      );
    };
  }, [ready]);

  return null;
};

export default TourReadyMarker;
