import { render } from "@testing-library/react";
// components
import { EntityStatusIcon } from "./EntityStatusIcon";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const entityStatusIconComplete = (
  <EntityStatusIcon isComplete={true}></EntityStatusIcon>
);

const entityStatusIconIncomplete = (
  <EntityStatusIcon isComplete={false}></EntityStatusIcon>
);

const entityStatusIconPdfComponent = (
  <EntityStatusIcon isComplete={true} isPdf={true}></EntityStatusIcon>
);

const entityStatusIconComponentIncompletePdf = (
  <EntityStatusIcon isComplete={false} isPdf={true}></EntityStatusIcon>
);

describe("<EntityStatusIcon />", () => {
  test("should show a success icon if entityComplete is true", () => {
    const { container } = render(entityStatusIconComplete);
    expect(container.querySelector("img[alt='complete icon']")).toBeVisible();
  });
  test("should show an error icon if entityComplete is false", () => {
    const { container } = render(entityStatusIconIncomplete);
    expect(container.querySelector("img[alt='warning icon']")).toBeVisible();
  });
  test("should show special text on a pdf page if required data is entered", async () => {
    const { findByText } = render(entityStatusIconPdfComponent);
    expect(await findByText("Complete")).toBeVisible();
  });

  testA11yAct(entityStatusIconComplete);
  testA11yAct(entityStatusIconIncomplete);
  testA11yAct(entityStatusIconPdfComponent);
  testA11yAct(entityStatusIconComponentIncompletePdf);
});
