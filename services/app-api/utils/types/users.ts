// USERS

export enum UserRoles {
  ADMIN = "mdctmcr-bor", // "MDCT MCR Business Owner Representative"
  HELP_DESK = "mdctmcr-help-desk", // "MDCT MCR Help Desk"
  INTERNAL = "mdctmcr-internal-user", // "MDCT MCR Internal User"
  APPROVER = "mdctmcr-approver", // "MDCT MCR Approver"
  STATE_USER = "mdctmcr-state-user", // "MDCT MCR State User"

  /**
   * Special Case:
   * The STATE_REP ROLE was rolled into the STATE_USER functionality in Jan 2024,
   * from MDCT MCR's perspective. See authorization.ts for implementation.
   *
   * The role still exists in IDM and users do exist with the role. State Rep users
   * have additional IDM authority to approve requests for State User accounts.
   *
   * If differentiation between the roles in MCR is required in the future, the consolidation can be unrolled.
   */
  STATE_REP = "mdctmcr-state-rep",
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
