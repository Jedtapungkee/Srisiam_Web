import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import { formatSizeForDisplay } from "../../utils/product";
import { formatDate } from "../../utils/user";
import OrderItem from "./OrderItem";
import OrderActions from "./OrderActions";

const OrderCard = ({ order, onOrderUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      "Not Process": {
        label: "รอดำเนินการ",
        variant: "secondary",
        icon: <Clock className="w-4 h-4" />,
        color: "text-gray-600"
      },
      "Processing": {
        label: "กำลังดำเนินการ",
        variant: "default",
        icon: <Package className="w-4 h-4" />,
        color: "text-blue-600"
      },
      "Completed": {
        label: "สำเร็จ",
        variant: "success",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-green-600"
      },
      "Cancelled": {
        label: "ยกเลิก",
        variant: "destructive",
        icon: <XCircle className="w-4 h-4" />,
        color: "text-red-600"
      }
    };
    return configs[status] || configs["Not Process"];
  };

  // Get payment status configuration
  const getPaymentStatusConfig = (status) => {
    const configs = {
      "PENDING": {
        label: "รอชำระเงิน",
        variant: "outline",
        color: "text-yellow-600"
      },
      "VERIFYING": {
        label: "รอตรวจสอบ",
        variant: "secondary",
        color: "text-blue-600"
      },
      "COMPLETED": {
        label: "ชำระแล้ว",
        variant: "success",
        color: "text-green-600"
      },
      "FAILED": {
        label: "ชำระไม่สำเร็จ",
        variant: "destructive",
        color: "text-red-600"
      },
      "CANCELLED": {
        label: "ยกเลิก",
        variant: "destructive",
        color: "text-red-600"
      }
    };
    return configs[status] || configs["PENDING"];
  };

  const statusConfig = getStatusConfig(order.orderStatus);
  const paymentConfig = order.payment 
    ? getPaymentStatusConfig(order.payment.status)
    : { label: "ไม่มีข้อมูล", variant: "outline", color: "text-gray-600" };

  const totalAmount = order.cartTotal + (order.shippingCost || 0);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              คำสั่งซื้อ #{order.id}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(order.createdAt, true)}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={statusConfig.variant}
              className="flex items-center gap-1"
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
            {order.payment && (
              <Badge 
                variant={paymentConfig.variant}
                className="flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3" />
                {paymentConfig.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">จำนวนสินค้า</p>
              <p className="font-semibold">{order.products?.length || 0} รายการ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ค่าจัดส่ง</p>
              <p className="font-semibold">฿{order.shippingCost?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ยอดรวมทั้งหมด</p>
              <p className="font-bold text-lg text-primary">฿{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {order.payment && (
          <div className="flex items-center gap-2 text-sm p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="text-muted-foreground">ช่องทางชำระเงิน:</span>
            <span className="font-medium">
              {order.payment.method === 'PROMPTPAY' ? 'พร้อมเพย์' : 
               order.payment.method === 'STRIPE' ? 'บัตรเครดิต' :
               order.payment.method === 'BANK_TRANSFER' ? 'โอนผ่านธนาคาร' :
               'เงินสด'}
            </span>
          </div>
        )}

        {/* Collapsible Products */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-3 h-auto"
            >
              <span className="font-medium">
                {isOpen ? 'ซ่อนรายละเอียดสินค้า' : 'ดูรายละเอียดสินค้า'}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-3">
            <div className="border-t pt-3">
              {order.products && order.products.length > 0 ? (
                order.products.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  ไม่มีข้อมูลสินค้า
                </div>
              )}
            </div>

            {/* Order Total Breakdown */}
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ยอดรวมสินค้า</span>
                <span className="font-medium">฿{order.cartTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span className="font-medium">฿{order.shippingCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-primary">฿{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <OrderActions order={order} onOrderCancelled={onOrderUpdate} />
      </CardContent>
    </Card>
  );
};

export default OrderCard;
