import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const appWrapper = document.getElementById("app-wrapper")!;
    appWrapper?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
