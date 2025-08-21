import { Outlet } from "react-router-dom";
import SimpleHeader from "./Header";
import DevBanner from "./DevBanner";
import HouseholdOnboarding from "./HouseholdPopUp";

export default function Layout() {
  return (
    <>
      <SimpleHeader />
      <HouseholdOnboarding />
      <Outlet />
    </>
  );
}
