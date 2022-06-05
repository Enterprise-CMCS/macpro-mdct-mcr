import { useMediaQuery } from "@chakra-ui/react";
import { convertBreakpoints, makeMediaQueryClasses } from "./useBreakpoint";

jest.mock("@chakra-ui/react", () => ({
  __esModule: true,
  useMediaQuery: jest.fn((array: boolean[]): boolean[] => array),
  useTheme: () => ({
    breakpoints: {
      sm: "35em",
      md: "55em",
      lg: "75em",
      xl: "100em",
    },
  }),
}));

const mockedUseMQ = useMediaQuery as unknown as jest.Mock<typeof useMediaQuery>;

describe("Test useBreakpoint convertBreakpoints method", () => {
  test("Breakpoints are converted from em to px correctly", () => {
    const pxBreaks = convertBreakpoints();
    expect(pxBreaks).toEqual({
      sm: 560,
      md: 880,
      lg: 1200,
      xl: 1600,
    });
  });
});

describe("Test useBreakpoint makeMediaQueryClasses method", () => {
  test("Mobile media query class calculated correctly ", () => {
    // return value if window.innerWidth <=35em|560px
    mockedUseMQ.mockImplementation((): any => [true, false, false, false]);
    const mqClasses = makeMediaQueryClasses();
    expect(mqClasses).toEqual("mobile");
  });

  test("Tablet media query class calculated correctly ", () => {
    // return value if window.innerWidth >35em|560px && <=55em|880px
    mockedUseMQ.mockImplementation((): any => [false, true, false, false]);
    const mqClasses = makeMediaQueryClasses();
    expect(mqClasses).toEqual("tablet");
  });

  test("Desktop media query class calculated correctly ", () => {
    // return value if window.innerWidth >55em|880px
    mockedUseMQ.mockImplementation((): any => [false, false, true, false]);
    const mqClasses = makeMediaQueryClasses();
    expect(mqClasses).toEqual("desktop");
  });

  test("Ultrawide media query class calculated correctly ", () => {
    // return value if window.innerWidth >100em|1600px
    mockedUseMQ.mockImplementation((): any => [false, false, true, true]);
    const mqClasses = makeMediaQueryClasses();
    expect(mqClasses).toEqual("desktop ultrawide");
  });
});
