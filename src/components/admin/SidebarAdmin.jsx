import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ChartBarStacked,
  PackageSearch,
  LogOut,
  UserRoundCog,
  X
} from "lucide-react";
import { Button } from "../ui/button";
import useSrisiamStore from "../../store/Srisiam-store";

const SidebarAdmin = ({ onClose }) => {
  const logout = useSrisiamStore((state) => state.logout);

  const handleLinkClick = () => {
    // Close mobile menu when link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-[#00204E] text-white w-64 flex flex-col h-full">
      {/* Header with close button on mobile */}
      <div className="h-16 sm:h-20 lg:h-24 bg-[#00204E] flex items-center justify-between px-4">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold">
          Admin Panel
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <NavLink
          to={"/admin"}
          end
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#021B3E] text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to={"/admin/category"}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#021B3E] text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <ChartBarStacked className="mr-3 h-5 w-5" />
          <span className="font-medium">Category</span>
        </NavLink>

        <NavLink
          to={"/admin/product"}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#021B3E] text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <PackageSearch className="mr-3 h-5 w-5" />
          <span className="font-medium">Product</span>
        </NavLink>

        <NavLink
          to={"/admin/user"}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#021B3E] text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <UserRoundCog className="mr-3 h-5 w-5" />
          <span className="font-medium">Manage User</span>
        </NavLink>

        <NavLink
          to={"/admin/order"}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#021B3E] text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <FolderKanban className="mr-3 h-5 w-5" />
          <span className="font-medium">Manage Order</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-600">
        <NavLink
          to={"/"}
          onClick={() => {
            logout();
            handleLinkClick();
          }}
          className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};
export default SidebarAdmin;
