import {
  AdminBannerData,
  DrawerEntityType,
  EntityShape,
  ErrorVerbiage,
  MCRUser,
  ModalDrawerEntityType,
  ReportMetadataShape,
  ReportShape,
  StandardEntityType,
} from "types";

// initial user state
export interface McrUserState {
  // INITIAL STATE
  user?: MCRUser;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser?: MCRUser) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}

// initial admin banner state
export interface AdminBannerState {
  // INITIAL STATE
  bannerData: AdminBannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: ErrorVerbiage | undefined;
  bannerDeleting: boolean;
  // ACTIONS
  setBannerData: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (
    bannerErrorMessage: ErrorVerbiage | undefined
  ) => void;
  setBannerDeleting: (bannerDeleting: boolean) => void;
}

// initial report state
export interface McrReportState {
  // INITIAL STATE
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  copyEligibleReportsByState: ReportMetadataShape[] | undefined;
  lastSavedTime: string | undefined;
  // ACTIONS
  setReport: (newReport: ReportShape | undefined) => void;
  setReportsByState: (
    newReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  clearReportsByState: () => void;
  setCopyEligibleReportsByState: (
    newCopyEligibleReportsByState: ReportMetadataShape[] | undefined
  ) => void;
  setLastSavedTime: (lastSavedTime: string | undefined) => void;
}

// initial entity state
export interface McrEntityState {
  // INITIAL STATE
  selectedEntity: EntityShape | undefined;
  entityType:
    | StandardEntityType
    | DrawerEntityType
    | ModalDrawerEntityType
    | undefined;
  entities: EntityShape[] | undefined;
  // ACTIONS
  setSelectedEntity: (newSelectedEntity: EntityShape | undefined) => void;
  setEntityType: (
    newEntityType:
      | StandardEntityType
      | DrawerEntityType
      | ModalDrawerEntityType
      | undefined
  ) => void;
  setEntities: (newEntities: EntityShape[] | undefined) => void;
}
