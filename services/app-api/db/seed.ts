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

const seed = async (): Promise<void> => {
  await loginSeedUsers();

  const questions: PromptObject[] = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        { title: "MCPAR", value: "mcparMenu" },
        { title: "MLR", value: "MLR" },
        { title: "NAAAR", value: "NAAAR" },
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
      case answer.toString().startsWith("createFilled"): {
        const reportType = answer.toString().replace("createFilled", "");
        createdLog(await createFilledReport(reportType), "Filled", reportType);
        break;
      }
      case answer.toString().startsWith("create"): {
        const reportType = answer.toString().replace("create", "");
        createdLog(await createReport(reportType), "Base", reportType);
        break;
      }
      case answer.toString().startsWith("createSubmitted"): {
        const reportType = answer.toString().replace("createSubmitted", "");
        createdLog(
          await createSubmittedReport(reportType),
          "Submitted",
          reportType
        );
        break;
      }
      case answer.toString().startsWith("createArchived"): {
        const reportType = answer.toString().replace("createArchived", "");
        createdLog(
          await createArchivedReport(reportType),
          "Archived",
          reportType
        );
        break;
      }
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
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
};

seed();
