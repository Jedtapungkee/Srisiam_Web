import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Addresscheckout from "./Addresscheckout";
import useSrisiamStore from "../../store/Srisiam-store";
import { listUserCart, createUserOrder } from "../../api/User"; // แก้ไขการ import
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

const SummaryCard = () => {
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // เพิ่ม state สำหรับ payment method
  const [selectedAddress, setSelectedAddress] = useState(null); // เพิ่ม state สำหรับ address
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม loading state
  const token = useSrisiamStore((state) => state.token);
  const navigate = useNavigate(); // เพิ่ม navigation hook

  // console.log(token)

  useEffect(() => {
    hdlgetUserCart(token);
  }, []);

  const hdlgetUserCart = async (token) => {
    const res = await listUserCart(token);
    setProducts(res.data.products);
    setCartTotal(res.data.cartTotal);
  };

  // ฟังก์ชันรับ address ที่เลือกจาก Addresscheckout
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  // ฟังก์ชันสำหรับจัดการการสั่งซื้อ
  const handleOrderSubmit = async () => {
    try {
      // ตรวจสอบว่าเลือก address แล้วหรือไม่
      if (!selectedAddress) {
        toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
        return;
      }

      // ตรวจสอบว่าเลือก payment method แล้วหรือไม่
      if (!selectedPaymentMethod) {
        toast.error("กรุณาเลือกวิธีชำระเงิน");
        return;
      }

      setIsLoading(true);

      // สร้าง/อัปเดต order พร้อมส่ง addressId (Backend จะบันทึก shippingCost อัตโนมัติ)
      const orderResponse = await createUserOrder(token, selectedAddress.id);

      if (orderResponse.data.ok) {
        const orderId = orderResponse.data.order.id;
        const totalAmount = cartTotal + SHIPPING_COST; // รวมค่าจัดส่ง สำหรับส่งไปยัง payment page
        const isUpdate = orderResponse.data.isUpdate;

        // แสดง toast ตามว่าเป็นการสร้างใหม่หรืออัปเดต
        if (isUpdate) {
          toast.success("อัปเดตคำสั่งซื้อสำเร็จ", {
            description: "กำลังนำคุณไปยังหน้าชำระเงิน"
          });
        } else {
          toast.success("สร้างคำสั่งซื้อสำเร็จ", {
            description: "กำลังนำคุณไปยังหน้าชำระเงิน"
          });
        }

        // นำทางไปหน้า payment ตาม payment method ที่เลือก
        if (selectedPaymentMethod === "PROMPTPAY") {
          navigate(`/payment/qr-code?orderId=${orderId}&amount=${totalAmount}`);
        } else if (selectedPaymentMethod === "STRIPE") {
          navigate(
            `/payment/credit-card?orderId=${orderId}&amount=${totalAmount}`
          );
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

  // console.log(products);
  // console.log(cartTotal);
  return (
    <div>
      <div>
        <Addresscheckout onAddressSelect={handleAddressSelect} />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">สรุปการสั่งซื้อ</h2>
        {/* Add summary details here */}
        <div>
          <Table className="mt-4 px-4 ">
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
                    {" "}
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
        {/* payment method */}
        <div className="mt-6 p-4 rounded">
          <div className="flex gap-4 items-center justify-center text-center">
            <h4 className="font-semibold">วิธีการชำระเงิน</h4>
            <button
              onClick={() => setSelectedPaymentMethod("PROMPTPAY")}
              className={`px-6 py-3 border-2 rounded transition-all ${
                selectedPaymentMethod === "PROMPTPAY"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50"
              }`}
            >
              QR พร้อมเพย์
            </button>
            <button
              onClick={() => setSelectedPaymentMethod("STRIPE")}
              className={`px-6 py-3 border-2 rounded transition-all ${
                selectedPaymentMethod === "STRIPE"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50"
              }`}
            >
              บัตรเครดิต/บัตรเดบิต
            </button>
          </div>
          {selectedPaymentMethod && (
            <div className="mt-3 text-center text-sm text-gray-600">
              เลือกแล้ว:{" "}
              {selectedPaymentMethod === "PROMPTPAY"
                ? "QR พร้อมเพย์"
                : "บัตรเครดิต/บัตรเดบิต"}
            </div>
          )}
        </div>
        {/* สรุปการสั่งซื้อ */}
        <div className="mt-6 p-4 rounded flex justify-end ">
          <div className="space-y-2">
            <div className="flex justify-between w-60">
              <span>รวมการสั่งซื้อ</span>
              <span>฿{cartTotal}</span>
            </div>
            <div className="flex justify-between w-60">
              <span>การจัดส่ง</span>
              <span>฿{SHIPPING_COST}</span>
            </div>
            <div className="flex justify-between items-center w-full gap-8">
              <div className="flex justify-between w-60 font-semibold text-red-500">
                <span>ยอดชำระทั้งหมด</span>
                <span>฿{cartTotal + SHIPPING_COST}</span>
              </div>
              <button
                onClick={handleOrderSubmit}
                disabled={!selectedPaymentMethod || isLoading}
                className={`px-8 py-3 rounded font-semibold transition-colors ${
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
    </div>
  );
};

export default SummaryCard;
