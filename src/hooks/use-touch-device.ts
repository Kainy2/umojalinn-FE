import { useEffect, useState } from "react";

// Touch-first devices never fire hover events, so hover-only affordances such as
// tooltips are unreachable there and need an always-visible fallback.
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const onChange = () => setIsTouchDevice(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => { mediaQuery.removeEventListener("change", onChange); };
  }, []);

  return isTouchDevice;
}
