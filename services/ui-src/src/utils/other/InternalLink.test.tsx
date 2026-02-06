import { render, screen } from "@testing-library/react";
import { InternalLink } from "./InternalLink";
import { MemoryRouter } from "react-router";

const mockUseParams = jest.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mockPageId",
});

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: () => mockUseParams(),
}));

describe("InternalLink", () => {
  it("converts an flatroute style path to a url in the href", () => {
    render(
      <MemoryRouter>
        <InternalLink to="/mcpar/myPage">Go To Page</InternalLink>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Go To Page" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/report/mockReportType/mockState/mockReportId/myPage"
    );
  });
});
