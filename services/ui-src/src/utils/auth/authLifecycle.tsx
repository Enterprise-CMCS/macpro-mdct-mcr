import { Hub } from "aws-amplify/utils";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { add } from "date-fns";
import { IDLE_WINDOW } from "../../constants";

let authManager: AuthManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  updateTimeout = debounce(() => this.setTimer());

  constructor() {
    // Force users with stale tokens greater than the timeout to log in for a fresh session
    const expiration = localStorage.getItem("mdctmcr_session_exp");
    const isExpired =
      expiration && new Date(expiration).valueOf() < Date.now().valueOf();
    if (isExpired) {
      localStorage.removeItem("mdctmcr_session_exp");
      signOut().then(() => {
        window.location.href = "/";
      });
    }

    Hub.listen("auth", (data) => {
      const { payload } = data;
      this.onHubEvent(payload);
    });
    this.updateTimeout();
  }

  /**
   * Track sign in events for users that log out and back in
   */
  onHubEvent(payload: any) {
    switch (payload.event) {
      case "signIn":
        this.setTimer();
        break;
      default:
        break;
    }
  }

  /**
   * Manual refresh of credentials paired with an instant timer clear
   */
  refreshCredentials = async () => {
    await fetchAuthSession({ forceRefresh: true }); // Force a token refresh
    this.setTimer();
  };

  /**
   * Timer function for idle timeout, keeps track of an idle timer that triggers a forced logout timer if not reset.
   */
  setTimer = () => {
    const expiration = add(Date.now(), {
      seconds: IDLE_WINDOW / 1000,
    }).toString();
    localStorage.setItem("mdctmcr_session_exp", expiration);
  };
}

// We're using a debounce because this can fire a lot...
const debounce = (func: Function, timeout = 2000) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const initAuthManager = () => {
  authManager = new AuthManager();
};

export const refreshCredentials = async () => {
  await authManager.refreshCredentials();
  return localStorage.getItem("mdctmcr_session_exp");
};

export const updateTimeout = async () => {
  await authManager.updateTimeout();
};

export const getExpiration = () => {
  return localStorage.getItem("mdctmcr_session_exp") || "";
};
