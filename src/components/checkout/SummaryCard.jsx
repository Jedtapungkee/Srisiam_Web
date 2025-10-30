import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addresscheckout from "./Addresscheckout";
import useSrisiamStore from "../../store/Srisiam-store";
import { listUserCart, createUserOrder } from "../../api/User";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatSizeForDisplay } from "../../utils/product";
import { toast } from "sonner";
import { SHIPPING_COST } from "../../config/constants";
import { Package } from "lucide-react";

const SummaryCard = () => {
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSrisiamStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    hdlgetUserCart(token);
  }, []);

  const hdlgetUserCart = async (token) => {
    const res = await listUserCart(token);
    setProducts(res.data.products);
    setCartTotal(res.data.cartTotal);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleOrderSubmit = async () => {
    try {
      if (!selectedAddress) {
        toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
        return;
      }

      if (!selectedPaymentMethod) {
        toast.error("กรุณาเลือกวิธีชำระเงิน");
        return;
      }

      setIsLoading(true);

      const orderResponse = await createUserOrder(token, selectedAddress.id);

      if (orderResponse.data.ok) {
        const orderId = orderResponse.data.order.id;
        const totalAmount = cartTotal + SHIPPING_COST;
        const isUpdate = orderResponse.data.isUpdate;

        if (isUpdate) {
          toast.success("อัปเดตคำสั่งซื้อสำเร็จ", {
            description: "กำลังนำคุณไปยังหน้าชำระเงิน"
          });
        } else {
          toast.success("สร้างคำสั่งซื้อสำเร็จ", {
            description: "กำลังนำคุณไปยังหน้าชำระเงิน"
          });
        }

        if (selectedPaymentMethod === "PROMPTPAY") {
          navigate(`/payment/qr-code?orderId=${orderId}&amount=${totalAmount}`);
        } else if (selectedPaymentMethod === "STRIPE") {
          navigate(`/payment/credit-card?orderId=${orderId}&amount=${totalAmount}`);
        }
      } else {
        toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Addresscheckout onAddressSelect={handleAddressSelect} />
      </div>
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">สรุปการสั่งซื้อ</h2>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {item.product.images.length > 0 ? (
                    <img
                      src={item.product?.images[0].url}
                      alt={item.product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2">
                    {item.product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    ไซส์: {formatSizeForDisplay(item.size)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-600">
                      ฿{item.price} × {item.count}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ฿{item.price * item.count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-30">สินค้า</TableHead>
                <TableHead className="w-[600px]"></TableHead>
                <TableHead>ราคาต่อชิ้น</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead>รวม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative">
                      {item.product.images.length > 0 ? (
                        <img
                          src={item.product?.images[0].url}
                          alt={item.product.title}
                          className="w-20 h-20 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.product.title}
                    <div className="text-sm text-gray-500">
                      ไซส์: {formatSizeForDisplay(item.size)}
                    </div>
                  </TableCell>
                  <TableCell>฿{item.price}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>฿{item.price * item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Payment Method */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base text-center">วิธีการชำระเงิน</h4>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setSelectedPaymentMethod("PROMPTPAY")}
                className={`px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-lg transition-all text-sm sm:text-base touch-manipulation ${
                  selectedPaymentMethod === "PROMPTPAY"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50"
                }`}
              >
                QR พร้อมเพย์
              </button>
              <button
                onClick={() => setSelectedPaymentMethod("STRIPE")}
                className={`px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-lg transition-all text-sm sm:text-base touch-manipulation ${
                  selectedPaymentMethod === "STRIPE"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50"
                }`}
              >
                บัตรเครดิต/บัตรเดบิต
              </button>
            </div>
            {selectedPaymentMethod && (
              <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-gray-600">
                เลือกแล้ว:{" "}
                {selectedPaymentMethod === "PROMPTPAY"
                  ? "QR พร้อมเพย์"
                  : "บัตรเครดิต/บัตรเดบิต"}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border shadow-sm">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span>รวมการสั่งซื้อ</span>
                <span>฿{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>การจัดส่ง</span>
                <span>฿{SHIPPING_COST}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-red-500 text-sm sm:text-base">
                <span>ยอดชำระทั้งหมด</span>
                <span>฿{cartTotal + SHIPPING_COST}</span>
              </div>
            </div>
            <button
              onClick={handleOrderSubmit}
              disabled={!selectedPaymentMethod || isLoading}
              className={`w-full px-4 sm:px-8 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base touch-manipulation ${
                !selectedPaymentMethod || isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              {isLoading ? "กำลังสร้างคำสั่งซื้อ..." : "สั่งสินค้า"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;