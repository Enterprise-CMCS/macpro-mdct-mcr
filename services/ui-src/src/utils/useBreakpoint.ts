import { useMediaQuery, useTheme } from "@chakra-ui/react";

export const convertBreakpoints = () => {
  // get breakpoints from theme
  const { breakpoints } = useTheme();
  const keys: string[] = Object.keys(breakpoints || {});

  // convert breakpoints from em to px
  let pxBreaks: { [key: string]: number } = {};
  keys.map((e: string) => {
    pxBreaks[e] = parseInt(breakpoints[e].slice(0, -2)) * 16;
  });
  return pxBreaks;
};

export const useBreakpoint = (): { [key: string]: boolean } => {
  const pxBreaks = convertBreakpoints();
  const [isMobile, isTablet, isDesktop, isUltrawide]: boolean[] = useMediaQuery(
    [
      // mobile (<=35em|560px)
      `(max-width: ${pxBreaks.sm}px)`,
      // tablet (>35em|560px and <=55em|880px)
      `(min-width: ${pxBreaks.sm + 1}px) and (max-width: ${pxBreaks.md}px)`,
      // desktop (>55em|880px)
      `(min-width: ${pxBreaks.md + 1}px)`,
      // ultrawide (>100em|1600px)
      `(min-width: ${pxBreaks.xl + 1}px)`,
    ]
  );
  return { isMobile, isTablet, isDesktop, isUltrawide };
};

export const makeMediaQueryClasses = (): string => {
  const { isMobile, isTablet, isDesktop, isUltrawide } = useBreakpoint();

  const mobileClass: string = isMobile ? "mobile" : ""; // mobile (<=35em|560px)
  const tabletClass: string = isTablet ? "tablet" : ""; // tablet (>35em|560px and <=55em|880px)
  const desktopClass: string = isDesktop ? "desktop" : ""; // desktop (>55em|880px)
  const ultrawideClass: string = isUltrawide ? "ultrawide" : ""; // ultrawide (>100em|1600px)

  const potentialClasses: string[] = [
    mobileClass,
    tabletClass,
    desktopClass,
    ultrawideClass,
  ];
  return potentialClasses.join(" ").trim();
};
