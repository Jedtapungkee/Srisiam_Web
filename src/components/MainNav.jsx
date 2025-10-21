import React, { use, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Search,
  ShoppingCart,
  MessageCircle,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useSrisiamStore from "../store/Srisiam-store";

const MainNav = () => {
  const productCategories = [
    { name: "เสื้อนักเรียน", link: "/shop?category=shirt" },
    { name: "กระโปรง/กางเกง", link: "/shop?category=bottom" },
    { name: "รองเท้า", link: "/shop?category=shoes" },
    { name: "อุปกรณ์", link: "/shop?category=accessories" },
  ];
  const carts = useSrisiamStore((state) => state.carts);
  const user = useSrisiamStore((state) => state.user);
  const logout = useSrisiamStore((state) => state.logout);
  return (
    <nav
      className="text-white shadow-lg relative z-50 overflow-hidden"
      style={{ backgroundColor: "#00204E" }}
    >
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Angular cuts on edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-white/5 transform -skew-x-12"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-blue-400/10 transform skew-x-12"></div>

        {/* Small geometric shapes */}
        <div className="absolute top-2 left-1/4 w-3 h-3 bg-white/20 transform rotate-45"></div>
        <div className="absolute top-4 right-1/3 w-2 h-2 bg-blue-300/30 transform rotate-45"></div>
        <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-yellow-400/40"></div>

        {/* Triangle accent */}
        <div
          className="absolute top-0 right-40 w-8 h-8 bg-white/10"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Angular Background */}
          <div className="flex-shrink-0 relative">
            <div className="absolute -inset-2 bg-white/10 transform -skew-x-12 rounded-sm"></div>
            <Link
              to="/"
              className="relative text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300 z-10 px-3 py-1"
            >
              Srisiam
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* หน้าหลัก */}
            <Link to="/">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-blue-300 font-medium transition-colors duration-300"
                >
                  หน้าหลัก
                </Button>
              </div>
            </Link>
            {/* สินค้า - Dropdown with Angular Styling */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    variant="ghost"
                    className="relative text-white hover:text-blue-300 font-medium flex items-center space-x-1 transition-colors duration-300"
                  >
                    <span>สินค้า</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden">
                {productCategories.map((category, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      to={category.link}
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ติดต่อ - Angular Button */}
            <Link to="/contact">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-blue-300 font-medium transition-colors duration-300"
                >
                  ติดต่อ
                </Button>
              </div>
            </Link>

            {/* เกี่ยวกับเรา - Angular Button */}
            <Link to="/address">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  variant="ghost"
                  className="relative text-white hover:text-blue-300 font-medium transition-colors duration-300"
                >
                  ที่อยู่
                </Button>
              </div>
            </Link>
          </div>

          {/* Right Side Icons - Angular Design */}
          <div className="flex items-center space-x-3">
            {/* Search Bar with Angular Border */}
            <div className="hidden lg:flex items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 transform -skew-x-12 rounded-full opacity-60 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Input
                  type="text"
                  placeholder="Search"
                  className="relative bg-white/20 text-white placeholder:text-blue-200 border-white/30 rounded-full px-4 py-2 pr-10 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-500 transition-all duration-200"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 z-10" />
              </div>
            </div>

            {/* Angular Icon Buttons */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/10 transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-10 h-10 shadow-md transition-all duration-300 transform hover:scale-110"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {carts.length}
                  </span>
                </Button>
              </Link>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-white/10 transform -rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button
                variant="ghost"
                size="icon"
                className="relative bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-10 h-10 shadow-md transition-all duration-300 transform hover:scale-110"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-white/10 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative bg-white text-gray-700 hover:bg-green-300 hover:text-gray-900 rounded-lg w-10 h-10 shadow-md transition-all duration-300 transform hover:scale-110"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden">
                {user ? (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link
                        to="user/profile"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        โปรไฟล์
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        to="user/order-history"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        คำสั่งซื้อ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/">
                        <Button
                          variant="ghost"
                          className="block w-full text-left text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                          onClick={logout}
                        >
                          ออกจากระบบ
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        to="/login"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        เข้าสู่ระบบ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        to="/register"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        สมัครสมาชิก
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
