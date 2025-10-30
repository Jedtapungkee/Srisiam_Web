import { Outlet, useLocation } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainNav from "../components/MainNav";
import MainFooter from "../components/MainFooter";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <MainHeader />
      <MainNav />
      <main className={`flex-1 w-full ${
        isHomePage 
          ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" 
          : "max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
      }`}>
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};
export default Layout;