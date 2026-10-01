import { Outlet } from "react-router-dom";

import PublicHeader from "../components/public-layout/PublicHeader";
import PublicContainer from "../components/public-layout/PublicContainer";
import PublicFooter from "../components/public-layout/PublicFooter";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <PublicHeader />

      <PublicContainer>
        <Outlet />
      </PublicContainer>

      <PublicFooter />
    </div>
  );
}