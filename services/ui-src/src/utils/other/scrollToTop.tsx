import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();
  const firstRouteRender = useRef(true);

  useEffect(() => {
    if (firstRouteRender.current) {
      firstRouteRender.current = false;
      return;
    }

    const focusHeading = () => {
      const target =
        document.querySelector("h1") ?? document.querySelector("#main-content");
      target?.setAttribute("tabindex", "-1");
      target?.focus();
      window.scrollTo(0, 0);
    };

    // Wait for the next paint
    const rafId = requestAnimationFrame(focusHeading);
    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
};
