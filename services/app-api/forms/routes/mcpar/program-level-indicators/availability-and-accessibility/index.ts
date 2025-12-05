import { ParentRoute } from "../../../../../utils/types";
import { accessMeasuresRoute } from "./access-measures";
import { networkAdequacyRoute } from "./network-adequacy";

export const availabilityAndAccessibilityRoute: ParentRoute = {
  name: "V: Availability & Accessibility",
  path: "/mcpar/program-level-indicators/availability-and-accessibility",
  children: [networkAdequacyRoute, accessMeasuresRoute],
};
