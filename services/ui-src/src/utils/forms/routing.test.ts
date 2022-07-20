import { makeNextRoute, makePreviousRoute } from "./routing";

const mockPathOrder = [
  "/base/fake-path-1",
  "/base/fake-path-2",
  "/base/fake-path-3",
];

describe("Test makeNextRoute", () => {
  it("Returns next path if there are subsequent form pages", () => {
    const route = makeNextRoute(mockPathOrder, "/fake-path-2");
    expect(route).toEqual("/base/fake-path-3");
  });
});

describe("Test makePreviousRoute", () => {
  it("Returns previous path if there are preceding form pages", () => {
    const route = makePreviousRoute(mockPathOrder, "/fake-path-2");
    expect(route).toEqual("/base/fake-path-1");
  });
});
