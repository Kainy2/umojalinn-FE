import { useLayoutEffect, useState } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const breakpoints: Record<Breakpoint, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
};

export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]}px)`,
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Initial check
    if (mediaQuery.matches) {
      setMatches(true);
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => { mediaQuery.removeEventListener('change', handleChange); };
  }, [breakpoint]);

  return matches;
}
