import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { 
  CreditCard, 
  MessageCircle, 
  RefreshCw,
  XCircle,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cancelUserOrder, createUserCart } from "../../api/User";
import useSriSiamStore from "../../store/Srisiam-store";

const OrderActions = ({ order, onOrderCancelled }) => {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [isGoingToCheckout, setIsGoingToCheckout] = React.useState(false);
  const token = useSriSiamStore((state) => state.token);

  const handleCancelOrder = async () => {
    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบ");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await cancelUserOrder(token, order.id);
      
      if (response.data.ok) {
        toast.success("ยกเลิกคำสั่งซื้อสำเร็จ", {
          description: `คำสั่งซื้อ #${order.id} ถูกยกเลิกแล้ว`
        });
        setCancelDialogOpen(false);
        
        // เรียก callback เพื่อ refresh รายการคำสั่งซื้อ
        if (onOrderCancelled) {
          onOrderCancelled();
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage = error.response?.data?.message || "ไม่สามารถยกเลิกคำสั่งซื้อได้";
      toast.error("เกิดข้อผิดพลาด", {
        description: errorMessage
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = () => {
    // TODO: Implement reorder functionality
    console.log("Reordering:", order.id);
    toast.success("เพิ่มสินค้าลงตะกร้าแล้ว", {
      description: "กำลังนำคุณไปยังตะกร้าสินค้า"
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `คำสั่งซื้อ #${order.id}`,
        text: `ดูรายละเอียดคำสั่งซื้อของฉัน #${order.id}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("คัดลอกลิงก์แล้ว!", {
        description: "ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว"
      });
    }
  };

  const actiongoCheckout = async () => {
    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบ");
      return;
    }

    setIsGoingToCheckout(true);
    try {
      // แปลง products จาก order เป็น format cart
      const cart = order.products.map(item => ({
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        images: item.product.images,
        category: item.product.category,
        count: item.count,
        price: item.price,
        sizeData: {
          size: item.size,
          price: item.price,
          quantity: item.count
        }
      }));

      // บันทึก cart
      await createUserCart(token, { cart });
      
      toast.success("บันทึกตะกร้าสินค้าเสร็จสิ้น", {
        description: "กำลังนำคุณไปยังหน้าชำระเงิน"
      });
      
      // ไปหน้า checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error saving cart:", error);
      toast.error("เกิดข้อผิดพลาด", {
        description: error?.response?.data?.message || "ไม่สามารถบันทึกตะกร้าสินค้าได้"
      });
    } finally {
      setIsGoingToCheckout(false);
    }
  }

  // เช็คว่ายังไม่ได้ชำระเงิน (ไม่มี payment หรือ status เป็น PENDING)
  const isPendingPayment = !order.payment || order.payment?.status === "PENDING";
  
  const canCancel = isPendingPayment && order.orderStatus !== "Cancelled";
  
  const canReorder = order.orderStatus === "Completed";

  return (
    <div className="flex flex-wrap gap-2 pt-2 items-center">
      {/* Left: secondary actions (reorder, contact, share) */}
      <div className="flex items-center gap-2">
        {/* Reorder Button */}
        {canReorder && (
          <Button 
            variant="outline" 
            className="min-w-[140px]" 
            size="sm"
            onClick={handleReorder}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            สั่งซื้ออีกครั้ง
          </Button>
        )}

        {/* Contact Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/contact'}
          className="min-w-[120px]"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          ติดต่อร้านค้า
        </Button>

       
      </div>

      {/* Right: primary actions (pay, cancel) - pushed to the right */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Pay Button - ไปหน้า Checkout */}
        {isPendingPayment && order.orderStatus !== "Cancelled" && (
          <Button 
            className="min-w-[150px]" 
            size="sm" 
            onClick={actiongoCheckout}
            disabled={isGoingToCheckout}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isGoingToCheckout ? "กำลังโหลด..." : "ชำระเงิน"}
          </Button>
        )}

        {/* Cancel Order Dialog - แสดงเมื่อยังไม่ชำระเงิน */}
        {canCancel && (
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="min-w-[150px]"
              >
                <XCircle className="w-4 h-4 mr-2" />
                ยกเลิกคำสั่งซื้อ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ยกเลิกคำสั่งซื้อ</DialogTitle>
                <DialogDescription>
                  คุณแน่ใจหรือไม่ที่ต้องการยกเลิกคำสั่งซื้อ #{order.id}? 
                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm space-y-2">
                    <p className="font-medium text-yellow-900">รายละเอียดคำสั่งซื้อ:</p>
                    <p className="text-yellow-700">
                      จำนวนสินค้า: {order.products?.length || 0} รายการ
                    </p>
                    <p className="text-yellow-700">
                      ยอดรวม: ฿{(order.cartTotal + (order.shippingCost || 0)).toFixed(2)}
                    </p>
                    <p className="text-yellow-700 font-medium mt-3">
                      ⚠️ คำสั่งซื้อนี้ยังไม่ได้ชำระเงิน
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setCancelDialogOpen(false)}
                  disabled={isCancelling}
                >
                  ไม่ยกเลิก
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {isCancelling ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default OrderActions;
