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
        <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-4 rounded-md">
          <div className=" rounded-full p-4 h-80 w-80 mx-auto mb-6 flex items-center justify-center">
            <img src="/images/LOGOSRISIAM.png" alt="Logo" />
          </div>
          <p className="text-black mb-8 leading-relaxed text-2xl text-center max-w-lg">
            กรุณาเข้าสู่ระบบเพื่อดูและจัดการที่อยู่สำหรับ
            <br />
            การจัดส่งสินค้า
          </p>
          <Link
            to="/auth/login"
            className="w-full bg-[#00204E] hover:bg-[#012f6e] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 max-w-xs mx-auto"
          >
            <LogIn className="w-5 h-5" />
            เข้าสู่ระบบ
          </Link>
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
