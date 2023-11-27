import { mockBannerData } from "./setupJest";
// types
import { AdminBannerState, McrUserState, UserRoles } from "types";

// USER STATES / STORE

export const mockNoUserStore: McrUserState = {
  user: undefined,
  showLocalLogins: true,
  setUser: () => {},
  setShowLocalLogins: () => {},
};

export const mockStateUserStoreNoReports: McrUserState = {
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

export const mockStateUserStore: McrUserState = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userReports: ["MCPAR", "MLR", "NAAAR"],
    userIsEndUser: true,
  },
  showLocalLogins: true,
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

// BOUND STORE

export const mockUseStore: McrUserState & AdminBannerState = {
  ...mockStateUserStore,
  ...mockBannerStore,
};
