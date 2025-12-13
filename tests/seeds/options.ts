import { Choice } from "../../services/app-api/utils/types";
import {
  fillMcpar,
  fillMlr,
  fillNaaar,
  newBanner,
  newMcpar,
  newMcparHasExpectedNaaarSubmission,
  newMcparHasNaaarSubmission,
  newMcparNewProgram,
  newMcparNewProgramPCCM,
  newMcparPCCM,
  newMlr,
  newNaaar,
  newNaaarNewProgram,
} from "./fixtures";
import { deleteApi, getApi, login, postApi, putApi } from "./helpers";
import { AwsHeaders, SeedBannerShape, SeedReportShape } from "./types";

const adminUser: string | undefined = process.env.SEED_ADMIN_USER_EMAIL;
const adminPassword: string | undefined = process.env.SEED_ADMIN_USER_PASSWORD;
const stateUser: string | undefined = process.env.SEED_STATE_USER_EMAIL;
const statePassword: string | undefined = process.env.SEED_STATE_USER_PASSWORD;
export const state: string = process.env.SEED_STATE || "MN";
const stateName: string = process.env.SEED_STATE_NAME || "Minnesota";

let headers: AwsHeaders = {};
let adminHeaders: AwsHeaders = {};

export const loginSeedUsers = async (): Promise<void> => {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  headers["x-api-key"] = stateLogin.IdToken;
  adminHeaders["x-api-key"] = adminLogin.IdToken;
};

// Reports
export const createReport = async (
  flags: { [key: string]: true },
  reportType: string
): Promise<SeedReportShape> => {
  const newReport = {
    MCPAR: newMcpar,
    "MCPAR-hasExpectedNaaarSubmission": newMcparHasExpectedNaaarSubmission,
    "MCPAR-hasNaaarSubmission": newMcparHasNaaarSubmission,
    "MCPAR-newProgram": newMcparNewProgram,
    "MCPAR-newProgramPCCM": newMcparNewProgramPCCM,
    "MCPAR-PCCM": newMcparPCCM,
    MLR: newMlr,
    NAAAR: newNaaar,
    "NAAAR-newProgram": newNaaarNewProgram,
  } as { [key: string]: Function };
  const data = newReport[reportType](flags, stateName, state);
  const baseReportType = reportType.split("-")[0];
  const report = await postApi(
    `/reports/${baseReportType}/${state}`,
    headers,
    data
  );
  return report;
};

export const createFilledReport = async (
  flags: { [key: string]: true },
  reportType: string
): Promise<SeedReportShape> => {
  const { id, programIsPCCM } = await createReport(flags, reportType);
  const baseReportType = reportType.split("-")[0];
  const report = await updateFillReport(
    id,
    baseReportType,
    flags,
    programIsPCCM
  );
  return report;
};

export const updateFillReport = async (
  id: string,
  reportType: string,
  flags: { [key: string]: true },
  programIsPCCM?: Choice[]
): Promise<SeedReportShape> => {
  const fillReport = {
    MCPAR: fillMcpar,
    MLR: fillMlr,
    NAAAR: fillNaaar,
  } as { [key: string]: Function };
  const data = fillReport[reportType](flags, programIsPCCM);
  const report = await putApi(
    `/reports/${reportType}/${state}/${id}`,
    headers,
    data
  );
  return report;
};

export const createSubmittedReport = async (
  flags: { [key: string]: true },
  reportType: string
): Promise<SeedReportShape> => {
  const { id } = await createFilledReport(flags, reportType);
  const baseReportType = reportType.split("-")[0];
  const report = await updateSubmitReport(id, baseReportType);
  return report;
};

export const updateSubmitReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/submit/${reportType}/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createArchivedReport = async (
  flags: { [key: string]: true },
  reportType: string
): Promise<SeedReportShape> => {
  const { id } = await createSubmittedReport(flags, reportType);
  const baseReportType = reportType.split("-")[0];
  const report = await updateArchiveReport(id, baseReportType);
  return report;
};

export const updateArchiveReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/archive/${reportType}/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

// Banners
export const createBanner = async (
  status: string
): Promise<SeedBannerShape> => {
  const banner = await postApi(`/banners`, adminHeaders, newBanner(status));
  return banner;
};

export const getBanners = async (): Promise<SeedBannerShape[]> => {
  const banners = await getApi(`/banners`, adminHeaders);
  return banners;
};

export const deleteBanners = async (): Promise<void> => {
  const banners = await getBanners();

  banners.map(async (banner: SeedBannerShape) => {
    await deleteApi(`/banners/${banner.key}`, adminHeaders);
  });
};
