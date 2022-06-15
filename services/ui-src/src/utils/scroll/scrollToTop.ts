import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animateScroll } from "react-scroll";

export const ScrollToTopComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollOnRouteChange();
  }, [pathname]);

  return null;
};

const scrollOnRouteChange = () => {
  animateScroll.scrollToTop({
    duration: 0,
  });
};

export const scrollToTopFormSubmit = () => {
  animateScroll.scrollToTop({
    duration: 1000,
    delay: 0,
    smooth: "easeOutQuint",
  });
};
