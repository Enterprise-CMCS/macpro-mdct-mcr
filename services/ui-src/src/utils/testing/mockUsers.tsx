// USERS

import { UserContextShape, UserRoles } from "types";

export const mockNoUser: UserContextShape = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateUser: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
    userReports: ["MCPAR", "MLR", "NAAAR"],
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateUserNoReports: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsEndUser: true,
    userReports: undefined,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateRep: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateApprover: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockHelpDeskUser: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockInternalUser: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockAdminUser: UserContextShape = {
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
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};
