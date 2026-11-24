import { expect, test } from "@playwright/test";
import {
  authenticatedRawRequest,
  buildForgedJwt,
  requestWithCustomToken,
} from "../../utils/requests";
import { stateAbbreviation, stateUserAuth } from "../../utils/consts";

const otherState = stateAbbreviation === "TX" ? "CA" : "TX";

test.describe("Authentic JWT should return a 200", () => {
  test("For a GET request from a state user for their own state's reports", async () => {
    const response = await authenticatedRawRequest(
      "GET",
      `/reports/MCPAR/${stateAbbreviation}`,
      undefined,
      stateUserAuth
    );
    expect(response.status).toBe(200);
  });
});

test.describe("Forged JWT should return a 401", () => {
  test("For a GET request claiming an admin role for another state's reports", async () => {
    const response = await requestWithCustomToken(
      "GET",
      `/reports/MCPAR/${otherState}`,
      buildForgedJwt(otherState)
    );
    expect(response.status).toBe(401);
  });
});
