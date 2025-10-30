import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ShoppingCart,
  MessageCircle,
  User,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";
import SearchBar from "./search/SearchBar";
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
import { listCategory } from "../api/Category";

const MainNav = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const carts = useSrisiamStore((state) => state.carts);
  const user = useSrisiamStore((state) => state.user);
  const logout = useSrisiamStore((state) => state.logout);

  /**
   * Fetch categories from API
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategory();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Handle search submission
   */
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  /**
   * Handle search clear
   */
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  /**
   * Handle category click
   */
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle mobile menu item click
   */
  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="text-white shadow-lg relative z-50 overflow-hidden"
      style={{ backgroundColor: "#00204E" }}
    >
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-full bg-white/5 transform -skew-x-12"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-blue-400/10 transform skew-x-12"></div>
        <div className="absolute top-2 left-1/4 w-3 h-3 bg-white/20 transform rotate-45"></div>
        <div className="absolute top-4 right-1/3 w-2 h-2 bg-blue-300/30 transform rotate-45"></div>
        <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-yellow-400/40"></div>
        <div
          className="absolute top-0 right-40 w-8 h-8 bg-white/10"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative">
            <div className="absolute -inset-2 bg-white/10 transform -skew-x-12 rounded-sm"></div>
            <Link
              to="/"
              className="relative text-lg sm:text-xl lg:text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300 z-10 px-3 py-1"
            >
              Srisiam
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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

            {/* Product Dropdown */}
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
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase">
                  หมวดหมู่สินค้า
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <span className="text-gray-400">กำลังโหลด...</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/shop"
                    className="block w-full px-4 py-2 text-[#001F3F] font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    ดูสินค้าทั้งหมด
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="ค้นหาสินค้า..."
                variant="navbar"
              />
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-9 h-9 sm:w-10 sm:h-10 shadow-md transition-all duration-300"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Cart */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/10 transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-9 h-9 sm:w-10 sm:h-10 shadow-md transition-all duration-300 transform hover:scale-110"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {carts.length}
                  </span>
                </Button>
              </Link>
            </div>

            {/* Chatbot */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/10 transform -rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link to="/chatbot">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-9 h-9 sm:w-10 sm:h-10 shadow-md transition-all duration-300 transform hover:scale-110"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-white/10 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative bg-white text-gray-700 hover:bg-green-300 hover:text-gray-900 rounded-lg w-9 h-9 sm:w-10 sm:h-10 shadow-md transition-all duration-300 transform hover:scale-110"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
                        to="/auth/login"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        เข้าสู่ระบบ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        to="/auth/register"
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        สมัครสมาชิก
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-white text-gray-700 hover:bg-blue-300 hover:text-gray-900 rounded-lg w-9 h-9 sm:w-10 sm:h-10 shadow-md transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="lg:hidden border-t border-white/20 py-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="ค้นหาสินค้า..."
              variant="mobile"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4 space-y-2">
            <Link to="/" onClick={handleMobileMenuClick}>
              <div className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-300 font-medium">
                หน้าหลัก
              </div>
            </Link>
            
            <div className="px-4 py-2">
              <div className="text-white/70 text-sm font-medium mb-2">หมวดหมู่สินค้า</div>
              <div className="space-y-1 pl-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="block w-full text-left px-3 py-2 text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-300"
                  >
                    {category.name}
                  </button>
                ))}
                <Link to="/shop" onClick={handleMobileMenuClick}>
                  <div className="block px-3 py-2 text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-300 font-medium">
                    ดูสินค้าทั้งหมด
                  </div>
                </Link>
              </div>
            </div>

            <Link to="/contact" onClick={handleMobileMenuClick}>
              <div className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-300 font-medium">
                ติดต่อ
              </div>
            </Link>

            <Link to="/address" onClick={handleMobileMenuClick}>
              <div className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-300 font-medium">
                ที่อยู่
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
