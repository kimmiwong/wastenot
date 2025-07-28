import { Outlet } from "react-router-dom";
import SimpleHeader from "./Header";
import DevBanner from "./DevBanner";

export default function Layout() {
  return (
    <>
      <SimpleHeader />
      <Outlet />
    </>
  );
}
