import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// types
import { McrUserState, MCRUser } from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: MCRUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

export const useStore = create(
  // persist and devtools are being used for debugging state
  persist(
    devtools<McrUserState>((set) => ({
      ...userStore(set),
    })),
    {
      name: "mcr-store",
    }
  )
);
