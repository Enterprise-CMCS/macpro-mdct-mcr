import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useLocation } from "react-router";
import config from "config";
// utils
import {
  authenticateWithIDM,
  getExpiration,
  getTokens,
  initAuthManager,
  logoutUser,
  updateTimeout,
  useStore,
} from "utils";
import { PRODUCTION_HOST_DOMAIN } from "../../constants";
// types
import { MCRUser, UserContextShape, UserRoles } from "types/users";

export const UserContext = createContext<UserContextShape>({
  logout: async () => {},
  loginWithIDM: async () => {},
  updateTimeout: () => {},
  getExpiration: () => {},
});

export const UserProvider = ({ children }: Props) => {
  const location = useLocation();
  const isProduction = window.location.origin.includes(PRODUCTION_HOST_DOMAIN);

  // state management
  const { user, showLocalLogins, setUser, setShowLocalLogins } = useStore();

  // Clear selectedReport from localStorage when logging out of report.
  const clearSelectedReportCache = () => {
    const selectReportCacheExists = localStorage.getItem("selectedReportType");
    selectReportCacheExists && localStorage.removeItem("selectedReportType");
  };

  // initialize the authentication manager that oversees timeouts
  initAuthManager();

  const logout = useCallback(async () => {
    try {
      setUser(undefined);
      clearSelectedReportCache();
      await logoutUser();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    // Allow Post Logout flow alongside user login flow
    if (location?.pathname.toLowerCase() === "/postlogout") {
      window.location.href = config.POST_SIGNOUT_REDIRECT;
      return;
    }

    try {
      const tokens = await getTokens();
      if (!tokens?.idToken) {
        throw new Error("Missing tokens auth session.");
      }
      const payload = tokens.idToken.payload;
      const { email, given_name, family_name } = payload as Record<
        string,
        string
      >;

      // "custom:cms_roles" is an string of concat roles so we need to check for the one applicable to MCR
      const cms_role = payload["custom:cms_roles"] as string;
      let userRole = cms_role.split(",").find((r) => r.includes("mdctmcr"));

      // consolidate "STATE_REP" role into "STATE_USER" role
      if (userRole === UserRoles.STATE_REP) {
        userRole = UserRoles.STATE_USER;
      }

      const state = payload["custom:cms_state"] as string | undefined;
      const full_name = [given_name, " ", family_name].join("");
      const userCheck = {
        userIsAdmin:
          userRole === UserRoles.ADMIN || userRole === UserRoles.APPROVER,
        userIsReadOnly:
          userRole === UserRoles.HELP_DESK || userRole === UserRoles.INTERNAL,
        userIsEndUser: userRole === UserRoles.STATE_USER,
      };
      const currentUser: MCRUser = {
        email,
        given_name,
        family_name,
        full_name,
        userRole,
        state,
        ...userCheck,
      };
      setUser(currentUser);
    } catch {
      if (isProduction) {
        await authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [isProduction, location]);

  // rerender on auth state change, checking router location
  useEffect(() => {
    checkAuthState();
  }, [location, checkAuthState]);

  const values: UserContextShape = useMemo(
    () => ({
      user,
      logout,
      showLocalLogins,
      loginWithIDM: authenticateWithIDM,
      updateTimeout,
      getExpiration,
    }),
    [user, logout, showLocalLogins]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

interface Props {
  children?: ReactNode;
}
