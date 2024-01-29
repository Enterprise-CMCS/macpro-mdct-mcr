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
