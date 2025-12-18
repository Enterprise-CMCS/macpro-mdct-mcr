import path from "path";
import { buildJson, buildForReportType } from "./build-json";

jest.mock("fs", () => ({
  promises: {
    readdir: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const fs = require("fs").promises;
function mockRequire(filePath: string, exportValue: any) {
  jest.mock(filePath, () => exportValue, { virtual: true });
}

const consoleSpy: {
  log: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  log: jest.spyOn(console, "log").mockImplementation(),
  error: jest.spyOn(console, "error").mockImplementation(),
};

describe("utils/routes/build-json", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildJson()", () => {
    test("builds JSON file for each report folder", async () => {
      const ROUTES_DIR = path.resolve("forms/routes");

      fs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === ROUTES_DIR) {
          return [
            { isDirectory: () => true, name: "mcpar" },
            { isDirectory: () => true, name: "naaar" },
          ];
        }
        return [];
      });

      mockRequire(path.join(ROUTES_DIR, "mcpar/index.ts"), {
        mcparReportJson: { reportType: "mcpar" },
      });

      mockRequire(path.join(ROUTES_DIR, "naaar/index.ts"), {
        naaarReportJson: { reportType: "naaar" },
      });

      await buildJson();

      expect(fs.writeFile).toHaveBeenCalledTimes(2);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.resolve("forms/mcpar.json"),
        expect.stringContaining('"reportType": "mcpar'),
        "utf8"
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.resolve("forms/naaar.json"),
        expect.stringContaining('"reportType": "naaar"'),
        "utf8"
      );
    });

    test("exits if no report folders", async () => {
      const ROUTES_DIR = path.resolve("forms/routes");

      fs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === ROUTES_DIR) {
          return [];
        }
        return [];
      });

      await buildJson();
      expect(consoleSpy.log).toHaveBeenCalledWith("No report folders found.");
    });
  });

  describe("buildForReportType()", () => {
    test("builds JSON file for each flag folder", async () => {
      const reportPath = path.resolve("forms/routes/mcpar");
      const flagsPath = path.join(reportPath, "flags");

      fs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === flagsPath) {
          return [
            { isDirectory: () => true, name: "flag1" },
            { isDirectory: () => true, name: "flag2" },
          ];
        }
        return [];
      });

      mockRequire(path.join(reportPath, "index.ts"), {
        mcparReportJson: { reportType: "mcpar" },
      });

      mockRequire(path.join(flagsPath, "flag1/index.ts"), {
        mcparReportJson: { reportType: "flag1" },
      });

      mockRequire(path.join(flagsPath, "flag2/index.ts"), {
        mcparReportJson: { reportType: "flag2" },
      });

      await buildForReportType(reportPath);

      expect(fs.writeFile).toHaveBeenCalledTimes(3);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.resolve("forms/mcpar.json"),
        expect.stringContaining('"reportType": "mcpar"'),
        "utf8"
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(flagsPath, "flag1.json"),
        expect.stringContaining('"reportType": "flag1"'),
        "utf8"
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(flagsPath, "flag2.json"),
        expect.stringContaining('"reportType": "flag2"'),
        "utf8"
      );

      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test("shows error if bad path for report folder", async () => {
      const reportPath = path.resolve("forms/error");
      fs.readdir.mockRejectedValueOnce(new Error());
      await buildForReportType(reportPath);
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test("shows error if bad path for flag folder", async () => {
      const reportPath = path.resolve("forms/routes/mcpar");
      const flagsPath = path.join(reportPath, "flags");

      fs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === flagsPath) {
          return [{ isDirectory: () => true, name: "error" }];
        }
        return [];
      });

      mockRequire(path.join(reportPath, "index.ts"), {
        mcparReportJson: { reportType: "mcpar" },
      });

      jest.doMock(
        path.join(flagsPath, "error/index.ts"),
        () => {
          throw new Error();
        },
        { virtual: true }
      );
      await buildForReportType(reportPath);
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });
});
