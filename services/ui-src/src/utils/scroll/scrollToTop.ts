import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
