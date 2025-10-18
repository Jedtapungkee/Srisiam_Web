import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 bg-[#c3c5ee] p-4 rounded shadow-sm h-[100px]">
        <Breadcrumb className="flex items-center space-x-2">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <h2 className="font-bold text-3xl">SriSiam</h2>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="font-bold" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-2xl font-medium">ตะกร้าสินค้า</h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Empty Cart Content */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-6">
            <ShoppingCart 
              size={80} 
              className="text-gray-300 mx-auto mb-4"
            />
          </div>
          
          {/* Message */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            ยังไม่มีสินค้าในตะกร้า
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            เริ่มต้นช้อปปิ้งและเพิ่มสินค้าที่คุณชื่นชอบลงในตะกร้าของคุณ
          </p>
          
          {/* Button */}
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#00204E] text-white px-6 py-3 rounded-lg hover:bg-[#033479] transition-colors relative z-10"
          >
            <ArrowLeft size={18} />
            เริ่มช้อปปิ้ง
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;