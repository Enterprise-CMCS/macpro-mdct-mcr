// utils
import { useUser } from "hooks/authHooks";
// components
import { Header, LocalLogins } from "components";
import AppRoutes from "./AppRoutes";

const App = () => {
  const { logout, user, showLocalLogins, loginWithIDM } = useUser();
  return (
    <div id="app-wrapper">
      {user && (
        <>
          <Header handleLogout={logout} />
          <AppRoutes />
        </>
      )}
      {!user && showLocalLogins && <LocalLogins loginWithIDM={loginWithIDM} />}
    </div>
  );
};

export default App;
