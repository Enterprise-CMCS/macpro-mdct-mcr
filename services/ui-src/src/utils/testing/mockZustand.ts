import {
  AdminBannerState,
  entityTypes,
  McrEntityState,
  McrReportState,
  McrUserState,
  ReportShape,
  UserRoles,
} from "types";
import {
  mockBannerData,
  mockMcparReport,
  mockReportsByState,
} from "./setupJest";

// USER STATES / STORE

export const mockNoUserStore: McrUserState = {
  user: undefined,
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserStore: McrUserState = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
    userReports: ["MCPAR", "MLR"],
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserNoReportsStore: McrUserState = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
    userReports: [""],
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateApproverStore: McrUserState = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
    userIsAdmin: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateRepStore: McrUserState = {
  user: {
    userRole: UserRoles.STATE_REP,
    email: "staterep@test.com",
    given_name: "Robert",
    family_name: "States",
    full_name: "Robert States",
    state: "MA",
    userIsEndUser: true,
  },
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockHelpDeskUserStore: McrUserState = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
    userIsReadOnly: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockAdminUserStore: McrUserState = {
  user: {
    userRole: UserRoles.ADMIN,
    email: "adminuser@test.com",
    given_name: "Adam",
    family_name: "Admin",
    full_name: "Adam Admin",
    state: undefined,
    userIsAdmin: true,
  },
  showLocalLogins: false,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

// BANNER STATES / STORE

export const mockBannerStore: AdminBannerState = {
  bannerData: mockBannerData,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: "",
  bannerDeleting: false,
  setBannerData: () => {},
  clearAdminBanner: () => {},
  setBannerActive: () => {},
  setBannerLoading: () => {},
  setBannerErrorMessage: () => {},
  setBannerDeleting: () => {},
};

// REPORT STATES / STORE

export const mockReportStore: McrReportState = {
  report: mockMcparReport as ReportShape,
  reportsByState: mockReportsByState,
  submittedReportsByState: [mockMcparReport],
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockEntityStore: McrEntityState = {
  selectedEntity: {
    id: "mock-id",
    type: entityTypes[0],
  },
  // ACTIONS
  setSelectedEntity: () => {},
  clearSelectedEntity: () => {},
};

export const mockEmptyReportStore: McrReportState = {
  report: undefined,
  reportsByState: undefined,
  submittedReportsByState: undefined,
  lastSavedTime: undefined,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
};

// BOUND STORE

export const mockUseStore: McrUserState & AdminBannerState & McrReportState = {
  ...mockReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
};

export const mockUseEmptyReportStore: McrUserState &
  AdminBannerState &
  McrReportState = {
  ...mockEmptyReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
};

export const mockUseAdminStore: McrUserState &
  AdminBannerState &
  McrReportState = {
  ...mockReportStore,
  ...mockAdminUserStore,
  ...mockBannerStore,
};

export const mockUseEntityStore: McrUserState &
  AdminBannerState &
  McrReportState &
  McrEntityState = {
  ...mockReportStore,
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockEntityStore,
};
