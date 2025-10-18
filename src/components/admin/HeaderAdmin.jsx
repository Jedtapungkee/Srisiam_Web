import { useLocation } from "react-router-dom";

const HeaderAdmin = ({ header }) => {
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
    <header className="bg-white h-16 flex items-center px-6">
      <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
    </header>
  );
};
export default HeaderAdmin;
