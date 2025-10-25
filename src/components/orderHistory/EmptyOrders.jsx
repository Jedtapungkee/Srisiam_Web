import React from "react";
import { Button } from "../ui/button";
import { ShoppingBag, Package } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="p-6 bg-muted rounded-full">
          <Package className="w-16 h-16 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full">
          <ShoppingBag className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">
        ยังไม่มีคำสั่งซื้อ
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-6">
        คุณยังไม่มีประวัติการสั่งซื้อสินค้า เริ่มช้อปปิ้งเพื่อสร้างคำสั่งซื้อแรกของคุณ
      </p>

      <Link to="/shop">
        <Button size="lg" className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          เริ่มช้อปปิ้ง
        </Button>
      </Link>
    </div>
  );
};

export default EmptyOrders;
