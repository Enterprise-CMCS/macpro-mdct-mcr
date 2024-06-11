import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import {
  AdminBannerData,
  AdminBannerState,
  EntityShape,
  McrEntityState,
  McrReportState,
  MCRUser,
  McrUserState,
  ReportMetadataShape,
  ReportShape,
} from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: MCRUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

// ADMIN BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: "",
  bannerDeleting: false,
  // actions
  setBannerData: (newBanner: AdminBannerData | undefined) =>
    set(() => ({ bannerData: newBanner }), false, { type: "setBannerData" }),
  clearAdminBanner: () =>
    set(() => ({ bannerData: undefined }), false, { type: "clearAdminBanner" }),
  setBannerActive: (bannerStatus: boolean) =>
    set(() => ({ bannerActive: bannerStatus }), false, {
      type: "setBannerActive",
    }),
  setBannerLoading: (loading: boolean) =>
    set(() => ({ bannerLoading: loading }), false, {
      type: "setBannerLoading",
    }),
  setBannerErrorMessage: (errorMessage: string) =>
    set(() => ({ bannerErrorMessage: errorMessage }), false, {
      type: "setBannerErrorMessage",
    }),
  setBannerDeleting: (deleting: boolean) =>
    set(() => ({ bannerDeleting: deleting }), false, {
      type: "setBannerDeleting",
    }),
});

// REPORT STORE
const reportStore = (set: Function) => ({
  // initial state
  report: undefined,
  reportsByState: undefined,
  copyEligibleReportsByState: undefined,
  lastSavedTime: undefined,
  // actions
  setReport: (newReport: ReportShape | undefined) =>
    set(() => ({ report: newReport }), false, { type: "setReport" }),
  setReportsByState: (newReportsByState: ReportMetadataShape[] | undefined) =>
    set(() => ({ reportsByState: newReportsByState }), false, {
      type: "setReportsByState",
    }),
  clearReportsByState: () =>
    set(() => ({ reportsByState: undefined }), false, {
      type: "clearReportsByState",
    }),
  setCopyEligibleReportsByState: (
    newCopyEligibleReportsByState: ReportMetadataShape[] | undefined
  ) =>
    set(
      () => ({ copyEligibleReportsByState: newCopyEligibleReportsByState }),
      false,
      { type: "setCopyEligibleReportsByState" }
    ),
  setLastSavedTime: (lastSavedTime: string | undefined) =>
    set(() => ({ lastSavedTime: lastSavedTime }), false, {
      type: "setLastSavedTime",
    }),
});

// ENTITY STORE
const entityStore = (set: Function) => ({
  // initial state
  selectedEntity: undefined,
  // actions
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) =>
    set(
      () => ({
        selectedEntity: newSelectedEntity,
      }),
      false,
      {
        type: "setSelectedEntity",
      }
    ),
  clearSelectedEntity: () =>
    set(() => ({ selectedEntity: undefined }), false, {
      type: "clearSelectedEntity",
    }),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<McrUserState & AdminBannerState & McrReportState & McrEntityState>(
      (set) => ({
        ...userStore(set),
        ...bannerStore(set),
        ...reportStore(set),
        ...entityStore(set),
      })
    ),
    {
      name: "mcr-store",
    }
  )
);
