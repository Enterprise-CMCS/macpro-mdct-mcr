/* eslint-disable no-console */
import prompts, { Choice, PromptObject } from "prompts";
import { createdLog, expandedLog } from "./helpers";
import { backToMenu, generateChoices } from "./options";
import {
  createArchivedReport,
  createBanner,
  createFilledReport,
  createReport,
  createSubmittedReport,
  deleteBanners,
  getBanners,
  loginSeedUsers,
} from "../../../tests/seeds/options";
// utils
import { isFeatureFlagEnabled } from "../utils/featureFlags/featureFlags";
// flagged routes
import * as mcparFlags from "../forms/routes/mcpar/flags";
import * as mlrFlags from "../forms/routes/mlr/flags";
import * as naaarFlags from "../forms/routes/naaar/flags";

const getEnabledFlagsByReportType = async (reportType: string) => {
  // Get LaunchDarkly flags from folder names in forms/routes/[reportType]/flags
  const flagMap: Record<string, any> = {
    MCPAR: mcparFlags,
    MLR: mlrFlags,
    NAAAR: naaarFlags,
  };

  const flagsByReportType = flagMap[reportType];
  const flagNames = Object.keys(flagsByReportType);

  // Get status of each flag from LaunchDarkly
  const evaluations = await Promise.all(
    flagNames.map(async (flagName) => {
      const enabled = await isFeatureFlagEnabled(flagName);
      return { flagName, enabled };
    })
  );

  return evaluations.reduce<Record<string, true>>(
    (enabledFlags, { flagName, enabled }) => {
      if (enabled) {
        enabledFlags[flagName] = true;
      }
      return enabledFlags;
    },
    {}
  );
};

const seed = async (): Promise<void> => {
  await loginSeedUsers();

  const reportTypes = ["MCPAR", "MLR", "NAAAR"];

  const questions: PromptObject[] = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        { title: "Quick Create Reports", value: "quickCreateReports" },
        ...reportTypes.map((report) => ({
          title: report,
          value: report === "MLR" ? report : `${report.toLowerCase()}Menu`,
        })),
        { title: "Banners", value: "banners" },
      ],
    },
    {
      type: (prev: string) => (prev === "mcparMenu" ? "select" : null),
      name: "task",
      message: "Task",
      choices: [
        { title: "MCPAR - Default", value: "MCPAR" },
        { title: "MCPAR - PCCM", value: "MCPAR-PCCM" },
        {
          title: "MCPAR - Has NAAAR Submission",
          value: "mcparNaaarSubmissionMenu",
        },
        { title: "MCPAR - New Program", value: "MCPAR-newProgram" },
        { title: "MCPAR - New Program PCCM", value: "MCPAR-newProgramPCCM" },
        backToMenu,
      ],
    },
    {
      type: (prev: string) =>
        prev === "mcparNaaarSubmissionMenu" ? "select" : null,
      name: "task",
      message: "Task",
      choices: [
        {
          title: "MCPAR - Has Submitted NAAAR Submission",
          value: "MCPAR-hasNaaarSubmission",
        },
        {
          title: "MCPAR - Has Expected NAAAR Submission",
          value: "MCPAR-hasExpectedNaaarSubmission",
        },
        backToMenu,
      ],
    },
    {
      type: (prev: string) => (prev === "naaarMenu" ? "select" : null),
      name: "task",
      message: "Task",
      choices: [
        { title: "NAAAR - Default", value: "NAAAR" },
        { title: "NAAAR - New Program", value: "NAAAR-newProgram" },
        backToMenu,
      ],
    },
    {
      type: (prev: string) =>
        [
          "MCPAR",
          "MCPAR-hasExpectedNaaarSubmission",
          "MCPAR-hasNaaarSubmission",
          "MCPAR-newProgram",
          "MCPAR-newProgramPCCM",
          "MCPAR-PCCM",
          "MLR",
          "NAAAR",
          "NAAAR-newProgram",
        ].includes(prev)
          ? "select"
          : null,
      name: "task",
      message: "Task",
      choices: (prev: string) => generateChoices(prev) as Choice[],
    },
    {
      type: (prev: string) => (prev === "banners" ? "select" : null),
      name: "bannerTask",
      message: "Task",
      choices: [
        {
          title: "Create Active Banner",
          value: "createBannerActive",
        },
        {
          title: "Create Inactive Banner",
          value: "createBannerInactive",
        },
        {
          title: "Create Scheduled Banner",
          value: "createBannerScheduled",
        },
        { title: "Get Banners", value: "getBanners" },
        {
          title: "Delete Banners",
          value: "deleteBanners",
        },
        backToMenu,
      ],
    },
    {
      type: (prev: string) => (prev === "back" ? null : "confirm"),
      name: "exit",
      message: "Exit?",
    },
  ];

  const onSubmit = async (
    prompt: PromptObject,
    answer: string | boolean
  ): Promise<void> => {
    switch (prompt.name) {
      case "exit": {
        if (answer === false) seed();
        break;
      }
      default:
        break;
    }

    switch (true) {
      case answer === "back":
        seed();
        break;
      // Banners
      case answer.toString().startsWith("createBanner"): {
        const bannerType = answer.toString().replace("createBanner", "");
        createdLog(
          await createBanner(bannerType.toLowerCase()),
          bannerType,
          "Banner"
        );
        break;
      }
      case answer === "getBanners":
        expandedLog(await getBanners());
        break;
      case answer === "deleteBanners": {
        await deleteBanners();
        console.log("Banners deleted.");
        break;
      }
      // Reports
      case answer.toString().startsWith("createFilled"): {
        const reportType = answer.toString().replace("createFilled", "");
        const baseReportType = reportType.split("-")[0];
        const flags = await getEnabledFlagsByReportType(baseReportType);
        createdLog(
          await createFilledReport(flags, reportType),
          "Filled",
          reportType
        );
        break;
      }
      case answer.toString().startsWith("createSubmitted"): {
        const reportType = answer.toString().replace("createSubmitted", "");
        const baseReportType = reportType.split("-")[0];
        const flags = await getEnabledFlagsByReportType(baseReportType);
        createdLog(
          await createSubmittedReport(flags, reportType),
          "Submitted",
          reportType
        );
        break;
      }
      case answer.toString().startsWith("createArchived"): {
        const reportType = answer.toString().replace("createArchived", "");
        const baseReportType = reportType.split("-")[0];
        const flags = await getEnabledFlagsByReportType(baseReportType);
        createdLog(
          await createArchivedReport(flags, reportType),
          "Archived",
          reportType
        );
        break;
      }
      case answer.toString().startsWith("create"): {
        const reportType = answer.toString().replace("create", "");
        const baseReportType = reportType.split("-")[0];
        const flags = await getEnabledFlagsByReportType(baseReportType);
        createdLog(await createReport(flags, reportType), "Base", reportType);
        break;
      }
      case answer === "quickCreateReports": {
        await Promise.all(
          reportTypes.map(async (reportType) => {
            const baseReportType = reportType.split("-")[0];
            const flags = await getEnabledFlagsByReportType(baseReportType);
            createdLog(
              await createFilledReport(flags, reportType),
              "Filled",
              reportType
            );
          })
        );
        break;
      }
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
};

seed();
