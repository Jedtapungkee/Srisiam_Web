import React, { useEffect } from "react";
import { CheckCircle, Link } from "lucide-react";
import { NavLink } from "react-router-dom";
import useSrisiamStore from "../../store/Srisiam-store";
import { listUserOrders } from "../../api/User";

const PaymentSuccess = () => {
  const actionClearCart = useSrisiamStore((state) => state.actionClearCart);

  // Clear cart state เมื่อโหลดหน้า 
  useEffect(() => {
    actionClearCart();
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async()=>{
    try {
      const res = await listUserOrders()
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
              <CheckCircle
                className="w-24 h-24 text-green-500 relative z-10"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            แจ้งชำระเงินสำเร็จ
          </h1>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            ทางร้านได้รับการแจ้งชำระเงินของคุณเรียบร้อยแล้ว
            <br />
            กรุณารอการตรวจสอบจากทางร้าน
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/">
              <button
                className="px-8 py-3 bg-[#00204E] text-white rounded-lg font-semibold hover:bg-[#001a3d] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                กลับหน้าหลัก
              </button>
            </NavLink>
            <NavLink to="/user/order-history">
              <button
                className="px-8 py-3 bg-white text-[#00204E] border-2 border-[#00204E] rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ดูคำสั่งซื้อของฉัน
            </button>
            </NavLink>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            หากมีข้อสงสัยหรือต้องการความช่วยเหลือ{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              ติดต่อเรา
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
