import { Outlet } from "react-router-dom";
import SimpleHeader from "./Header";

export default function Layout() {
  return (
    <>
      <SimpleHeader />
      <Outlet />
    </>
  );
}
