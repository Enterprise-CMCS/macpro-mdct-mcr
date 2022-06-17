import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("main-content")!.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
