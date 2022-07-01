export const focusField = (fieldName: string) => {
  // calculate position of field
  const field = document.querySelector(`[name='${fieldName}']`)! as HTMLElement;
  const fieldTop = field?.getBoundingClientRect().top!;
  const headerHeight = document
    .getElementById("header")
    ?.getBoundingClientRect()!.height!;
  const scrollOffset = 16 * 6; // 6rem

  // if not visible, smooth scroll into view
  if (fieldTop <= headerHeight) {
    const scrollLength = fieldTop - headerHeight - scrollOffset;
    window.scrollBy({ top: scrollLength, left: 0, behavior: "smooth" });
  }

  // focus field without additional scrolling
  field?.focus({ preventScroll: true });
};
