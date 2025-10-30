import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const HeaderAdmin = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin/product":
        return "จัดการสินค้า";
      case "/admin/orders":
        return "จัดการคำสั่งซื้อ";
      case "/admin/users":
        return "จัดการผู้ใช้";
      case "/admin/category":
        return "จัดการหมวดหมู่สินค้าและระดับการศึกษา";
      case "/admin/user":
        return "จัดการผู้ใช้";
      case "/admin/order":
        return "จัดการคำสั่งซื้อ";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-gray-200">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2 sm:mr-4"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 truncate">
          {getPageTitle()}
        </h1>
      </div>
    </header>
  );
};
export default HeaderAdmin;
