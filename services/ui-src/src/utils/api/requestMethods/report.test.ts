import {
  archiveReport,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  releaseReport,
  submitReport,
} from "./report";
import { beforeEach, describe, expect, test, vi } from "vitest";
// utils
import { mockReportKeys, mockMcparReport } from "utils/testing/setupTests";
import { initAuthManager } from "utils/auth/authLifecycle";

const mockDelete = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
}));

describe("utils/requestMethods/report", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    initAuthManager();
    vi.runAllTimers();
    vi.clearAllMocks();
  });

  test("archiveReport()", async () => {
    await archiveReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("getReport()", async () => {
    await getReport(mockReportKeys);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState()", async () => {
    await getReportsByState("MCPAR", "AB");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postReport()", async () => {
    await postReport("MCPAR", "AB", mockMcparReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("putReport()", async () => {
    await putReport(mockReportKeys, mockMcparReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("releaseReport()", async () => {
    await releaseReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    await submitReport(mockReportKeys);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
