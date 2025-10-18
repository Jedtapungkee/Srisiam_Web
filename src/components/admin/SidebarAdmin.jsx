import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ChartBarStacked,
  PackageSearch,
  LogOut,
  UserRoundCog
} from "lucide-react";
import useSrisiamStore from "../../store/Srisiam-store";
const SidebarAdmin = () => {
  const logout = useSrisiamStore((state) => state.logout);
  return (
    <div className="bg-[#00204E] text-white w-64 flex flex-col h-screen">
      <div className="h-24 bg-[#00204E] flex items-center text-2xl justify-center font-bold">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <LayoutDashboard className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to={"/admin/category"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ChartBarStacked className="mr-2" />
          Category
        </NavLink>
        <NavLink
          to={"/admin/product"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <PackageSearch className="mr-2" />
          Product
        </NavLink>
        <NavLink
          to={"/admin/user"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <UserRoundCog className="mr-2" />
          Manage User
        </NavLink>
        <NavLink
          to={"/admin/order"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <FolderKanban className="mr-2" />
          Manage order
        </NavLink>
      </nav>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "bg-[#021B3E] text-white  flex items-center px-4 py-2 rounded"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
          to={"/"}
          onClick={() => logout()}
        >
          <LogOut className="mr-2" />
          Logout
        </NavLink>
      </div>
    </div>
  );
};
export default SidebarAdmin;
