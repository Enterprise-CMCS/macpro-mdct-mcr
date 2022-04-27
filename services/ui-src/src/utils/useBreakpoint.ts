import { useMediaQuery, useTheme } from "@chakra-ui/react";

export const useBreakpoint = () => {
  // get breakpoints from theme
  const { breakpoints } = useTheme();
  const keys: string[] = Object.keys(breakpoints || {});

  // convert breakpoints from em to px
  let pxBreaks: { [key: string]: number } = {};
  keys.map((e: string) => {
    pxBreaks[e] = parseInt(breakpoints[e].slice(0, -2)) * 16;
  });

  const [isMobile, isTablet, isDesktop, isUltrawide] = useMediaQuery([
    `(max-width: ${pxBreaks.sm}px)`, // mobile (<=35em|560px)
    `(min-width: ${pxBreaks.sm + 1}px) and (max-width: ${pxBreaks.md}px)`, // tablet (>35em|560px and <=55em|880px)
    `(min-width: ${pxBreaks.md + 1}px)`, // desktop (>55em|880px)
    `(min-width: ${pxBreaks.xl + 1}px)`, // ultrawide (>100em|1600px)
  ]);

  return { isMobile, isTablet, isDesktop, isUltrawide };
};

export const makeMediaQueryClasses = () => {
  const { isMobile, isTablet, isDesktop, isUltrawide } = useBreakpoint();

  const mobileClass = isMobile ? "mobile" : ""; // mobile (<=35em|560px)
  const tabletClass = isTablet ? "tablet" : ""; // tablet (>35em|560px and <=55em|880px)
  const desktopClass = isDesktop ? "desktop" : ""; // desktop (>55em|880px)
  const ultrawideClass = isUltrawide ? "ultrawide" : ""; // ultrawide (>100em|1600px)

  const combinedClassString = `${mobileClass} ${tabletClass} ${desktopClass} ${ultrawideClass}`;
  return combinedClassString;
};
