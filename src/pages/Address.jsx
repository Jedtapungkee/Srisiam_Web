import React from "react";
import { User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import ListAddress from "../components/address/listaddress";
import BreadcrumbAddress from "../components/address/BreadcrumbAddress";
import useSrisiamStore from "../store/Srisiam-store";

const Address = () => {
  const user = useSrisiamStore((state) => state.user);
  return (
    <div>
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              คุณต้องเข้าสู่ระบบเพื่อดูและจัดการที่อยู่สำหรับการจัดส่งสินค้า
            </p>
            <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <BreadcrumbAddress />
          <ListAddress />
        </div>
      )}
    </div>
  );
};

export default Address;
