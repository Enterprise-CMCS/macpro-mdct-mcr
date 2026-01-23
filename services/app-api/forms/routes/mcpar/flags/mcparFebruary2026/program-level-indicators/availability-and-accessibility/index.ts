import { ParentRoute } from "../../../../../../../utils/types";
import { accessMeasuresRoute } from "../../../../program-level-indicators/availability-and-accessibility/access-measures";

export const availabilityAndAccessibilityRoute: ParentRoute = {
  name: "V: Availability & Accessibility",
  path: "/mcpar/program-level-indicators/availability-and-accessibility",
  children: [accessMeasuresRoute],
};
