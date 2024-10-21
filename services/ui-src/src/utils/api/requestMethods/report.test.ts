import {
  archiveReport,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  releaseReport,
  submitReport,
} from "./report";
// utils
import { mockReportKeys, mockMcparReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

const mockAmplifyApi = require("aws-amplify/api");

describe("Test report status methods", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
    jest.clearAllMocks();
  });
  test("archiveReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await archiveReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("getReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await getReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await getReportsByState("MCPAR", "AB");
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("postReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await postReport("MCPAR", "AB", mockMcparReport);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("putReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await putReport(mockReportKeys, mockMcparReport);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
  test("releaseReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await releaseReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await submitReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
