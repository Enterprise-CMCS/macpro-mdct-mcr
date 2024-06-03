// USERS

export enum UserRoles {
  ADMIN = "mdctmcr-bor", // "MDCT MCR Business Owner Representative"
  HELP_DESK = "mdctmcr-help-desk", // "MDCT MCR Help Desk"
  INTERNAL = "mdctmcr-internal-user", // "MDCT MCR Internal User"
  APPROVER = "mdctmcr-approver", // "MDCT MCR Approver"
  STATE_USER = "mdctmcr-state-user", // "MDCT MCR State User"
  // old roles
  STATE_REP = "mdctmcr-state-rep", // removed Jan 2024 (consolidated to STATE_USER)
}

export interface MCRUser {
  email: string;
  given_name: string;
  family_name: string;
  full_name: string;
  state?: string;
  userRole?: string;
  userIsAdmin?: boolean;
  userIsReadOnly?: boolean;
  userIsEndUser?: boolean;
}

export interface UserContextShape {
  user?: MCRUser;
  showLocalLogins?: boolean;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
  updateTimeout: () => void;
  getExpiration: Function;
}
