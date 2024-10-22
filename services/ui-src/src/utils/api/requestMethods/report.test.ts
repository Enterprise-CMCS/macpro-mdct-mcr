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

const mockDelete = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockTimeout = jest.fn();

jest.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
  updateTimeout: () => mockTimeout(),
}));

describe("report", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
    jest.clearAllMocks();
  });

  test("archiveReport()", async () => {
    await archiveReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("getReport()", async () => {
    await getReport(mockReportKeys);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState()", async () => {
    await getReportsByState("MCPAR", "AB");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("postReport()", async () => {
    await postReport("MCPAR", "AB", mockMcparReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("putReport()", async () => {
    await putReport(mockReportKeys, mockMcparReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("releaseReport()", async () => {
    await releaseReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    await submitReport(mockReportKeys);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });
});
