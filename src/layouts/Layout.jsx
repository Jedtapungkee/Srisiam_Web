import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainNav from "../components/MainNav";
import MainFooter from "../components/MainFooter";

const Layout = () => {
  return (
    <div>
      <MainHeader />
      <MainNav />
      <main className="h-full px-4  mx-auto my-4">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};
export default Layout;