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
        { title: "MCPAR", value: "MCPAR" },
        { title: "MLR", value: "MLR" },
        { title: "NAAAR", value: "NAAAR" },
        { title: "Banners", value: "banners" },
      ],
    },
    {
      type: (prev: string) =>
        ["MCPAR", "MLR", "NAAAR"].includes(prev) ? "select" : null,
      name: "task",
      message: "Task",
      choices: (prev: string) => {
        return generateChoices(prev) as Choice[];
      },
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
        if (answer === false) {
          seed();
        }
        break;
      }
      default:
        break;
    }

    switch (answer) {
      case "back":
        seed();
        break;
      case "createMCPAR":
      case "createMLR":
      case "createNAAAR": {
        const reportType = answer.replace("create", "");
        createdLog(await createReport(reportType), "Base", reportType);
        break;
      }
      case "createFilledMCPAR":
      case "createFilledMLR":
      case "createFilledNAAAR": {
        const reportType = answer.replace("createFilled", "");
        createdLog(await createFilledReport(reportType), "Filled", reportType);
        break;
      }
      case "createSubmittedMCPAR":
      case "createSubmittedMLR":
      case "createSubmittedNAAAR": {
        const reportType = answer.replace("createSubmitted", "");
        createdLog(
          await createSubmittedReport(reportType),
          "Submitted",
          reportType
        );
        break;
      }
      case "createArchivedMCPAR":
      case "createArchivedMLR":
      case "createArchivedNAAAR": {
        const reportType = answer.replace("createArchived", "");
        createdLog(
          await createArchivedReport(reportType),
          "Archived",
          reportType
        );
        break;
      }
      case "createBannerActive":
      case "createBannerInactive":
      case "createBannerScheduled": {
        const bannerType = answer.replace("createBanner", "");
        createdLog(
          await createBanner(bannerType.toLowerCase()),
          bannerType,
          "Banner"
        );
        break;
      }
      case "getBanners":
        expandedLog(await getBanners());
        break;
      case "deleteBanners": {
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
