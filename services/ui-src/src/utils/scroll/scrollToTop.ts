import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("skip-nav-main")!.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
