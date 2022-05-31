import { convertBreakpoints } from "./useBreakpoint";

jest.mock("@chakra-ui/react", () => ({
  __esModule: true,
  // useMediaQuery: (array: boolean[]): boolean[] => array,
  useTheme: () => ({
    breakpoints: {
      sm: "35em",
      md: "55em",
      lg: "75em",
      xl: "100em",
    },
  }),
}));

describe("Test useBreakpoint convertBreakpoints method", () => {
  test("breakpoints are converted from em to px correctly", () => {
    const pxBreaks = convertBreakpoints();
    expect(pxBreaks).toEqual({
      sm: 560,
      md: 880,
      lg: 1200,
      xl: 1600,
    });
  });
});
