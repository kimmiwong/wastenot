import { Outlet, useLocation } from "react-router-dom";
import SimpleHeader from "./Header";
import DevBanner from "./DevBanner";
import HouseholdOnboarding from "./HouseholdPopUp";

export default function Layout() {
  const location = useLocation();
  const isLoggingOut = location.pathname === "/logout";

  return (
    <>
      {!isLoggingOut && <SimpleHeader />}
      {!isLoggingOut && <HouseholdOnboarding />}
      <Outlet />
    </>
  );
}
