import * as local from "./focusElement";

export const checkElementPosition = (element: HTMLElement) => {
  // calculate position of element
  const elementTop = element?.getBoundingClientRect().top!;
  const headerHeight = document
    .getElementById("header")
    ?.getBoundingClientRect()!.height!;
  const scrollOffset = 16 * 6; // 6rem
  // if element not visible
  const shouldScroll = elementTop <= headerHeight;
  const scrollDistance = elementTop - headerHeight - scrollOffset;
  return { shouldScroll, scrollDistance };
};

export const focusElement = (element: HTMLElement) => {
  const { shouldScroll, scrollDistance } = local.checkElementPosition(element);
  // smooth scroll into view if necessary
  if (shouldScroll) {
    window.scrollBy({ top: scrollDistance, left: 0, behavior: "smooth" });
  }
  // focus element without additional scrolling
  element?.focus({ preventScroll: true });
};
