import {
  mockBannerData,
  mockErrorMessage,
  mockMcparReport,
  mockMLRLockedReport,
  mockMlrReport,
  mockNaaarReport,
  mockNaaarReportWithAnalysisMethods,
  mockReportsByState,
} from "./setupJest";
// types
import {
  AdminBannerState,
  EntityType,
  McrEntityState,
  McrReportState,
  McrUserState,
  UserRoles,
} from "types";

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

export const mockInternalUserStore: McrUserState = {
  user: {
    userRole: UserRoles.INTERNAL,
    email: "internaluser@test.com",
    given_name: "Inside",
    family_name: "Cat",
    full_name: "Inside Cat",
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

//  BANNER STATES / STORE

export const mockBannerStore: AdminBannerState = {
  allBanners: [mockBannerData],
  bannerData: mockBannerData,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: mockErrorMessage,
  bannerDeleting: false,
  setBannerData: () => {},
  clearAdminBanner: () => {},
  setAllBanners: () => {},
  setBannerActive: () => {},
  setBannerLoading: () => {},
  setBannerErrorMessage: () => {},
  setBannerDeleting: () => {},
};

// REPORT STATES / STORE
export const mockMcparReportStore: McrReportState = {
  report: mockMcparReport,
  reportsByState: [mockMcparReport],
  copyEligibleReportsByState: mockReportsByState,
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockMlrReportStore: McrReportState = {
  report: mockMlrReport,
  reportsByState: [mockMlrReport],
  copyEligibleReportsByState: [],
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockMlrLockedReportStore: McrReportState = {
  report: mockMLRLockedReport,
  reportsByState: [mockMLRLockedReport],
  copyEligibleReportsByState: [],
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockNaaarReportStore: McrReportState = {
  report: mockNaaarReport,
  reportsByState: [mockNaaarReport],
  copyEligibleReportsByState: mockReportsByState,
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockNaaarAnalysisMethodsReportStore: McrReportState = {
  report: mockNaaarReportWithAnalysisMethods,
  reportsByState: [mockNaaarReportWithAnalysisMethods],
  copyEligibleReportsByState: mockReportsByState,
  lastSavedTime: "1:58 PM",
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

export const mockEmptyReportStore: McrReportState = {
  report: undefined,
  reportsByState: undefined,
  copyEligibleReportsByState: undefined,
  lastSavedTime: undefined,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setCopyEligibleReportsByState: () => {},
  setLastSavedTime: () => {},
};

// ENTITY STATES / STORE
export const mockEntityStore: McrEntityState = {
  entities: [],
  entityType: EntityType.PLANS,
  selectedEntity: {
    id: "mock-plan-id-1",
    type: EntityType.PLANS,
    report_planName: "mock-plan",
    report_programName: "mock-programName",
    report_programType: [
      {
        key: "report-programType-mock",
        value: "mock value",
      },
    ],
    report_eligibilityGroup: [
      {
        key: "report-eligibilityGroup-mock",
        value: "mock value",
      },
    ],
    report_reportingPeriodStartDate: "11/11/2011",
    report_reportingPeriodEndDate: "11/11/2011",
    measure_activities: [
      {
        key: "measure_activities-mock",
        value: "mock value",
      },
    ],
    measure_dataVersion: [
      {
        key: "measure_dataVersion-mock",
        value: "mock value",
      },
    ],
    measure_identifierCmit: "1234",
    measure_rates: [
      {
        id: "mock-rate-1",
        name: "mock rate 1",
      },
    ],
  },
  // ACTIONS
  setSelectedEntity: () => {},
  setEntityType: () => {},
  setEntities: () => {},
};

export const mockAnalysisMethodEntityStore: McrEntityState = {
  entities: [],
  entityType: EntityType.ANALYSIS_METHODS,
  selectedEntity: {
    id: "k9t7YoOeTOAXX3s7qF6XfN33",
    name: "Geomapping",
    isRequired: true,
  },
  // ACTIONS
  setSelectedEntity: () => {},
  setEntityType: () => {},
  setEntities: () => {},
};

// BOUND STORE

export const mockUseStore: McrUserState & AdminBannerState & McrReportState = {
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockMcparReportStore,
  ...mockMlrReport,
  ...mockEmptyReportStore,
  ...mockEntityStore,
};
