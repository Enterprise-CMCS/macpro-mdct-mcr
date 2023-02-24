// import { mockReport } from "utils/testing/setupJest";
import { getRouteStatus } from "./getRouteStatus";

describe("getRouteStatus", () => {
  it("should return an empty array when report is falsy", () => {
    expect(getRouteStatus(undefined)).toEqual([]);
  });

  it("should return an array of valid routes", () => {
    const report = {
      formTemplate: {
        routes: [
          {
            name: "Route 1",
            path: "/route1",
            pageType: "normal",
            children: [
              {
                name: "Child 1",
                path: "/route1/child1",
                pageType: "normal",
              },
              {
                name: "Child 2",
                path: "/route1/child2",
                pageType: "normal",
              },
            ],
          },
          {
            name: "Route 2",
            path: "/route2",
            pageType: "normal",
          },
          {
            name: "Route 3",
            path: "/route3",
            pageType: "normal",
            children: [
              {
                name: "Child 3",
                path: "/route3/child3",
                pageType: "normal",
                children: [
                  {
                    name: "Grandchild 1",
                    path: "/route3/child3/grandchild1",
                    pageType: "normal",
                  },
                ],
              },
            ],
          },
          {
            name: "Review and Submit",
            path: "/review-submit",
            pageType: "reviewSubmit",
          },
        ],
      },
    };

    const expectedOutput = [
      {
        name: "Route 1",
        path: "/route1",
        status: undefined,
        children: [
          {
            name: "Child 1",
            path: "/route1/child1",
            status: undefined,
            children: undefined,
          },
          {
            name: "Child 2",
            path: "/route1/child2",
            status: undefined,
            children: undefined,
          },
        ],
      },
      {
        name: "Route 2",
        path: "/route2",
        status: undefined,
        children: undefined,
      },
      {
        name: "Route 3",
        path: "/route3",
        status: undefined,
        children: [
          {
            name: "Child 3",
            path: "/route3/child3",
            status: undefined,
            children: [
              {
                name: "Grandchild 1",
                path: "/route3/child3/grandchild1",
                status: "error",
              },
            ],
          },
        ],
      },
    ];

    expect(getRouteStatus(report)).toEqual(expectedOutput);
  });
});
