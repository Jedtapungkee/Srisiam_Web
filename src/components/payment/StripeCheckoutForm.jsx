import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { confirmStripePayment } from "../../api/Payment";
import useSrisiamStore from "../../store/Srisiam-store";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
      padding: "12px",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

const StripeCheckoutForm = ({ clientSecret, orderId, amount, paymentId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const token = useSrisiamStore((state) => state.token);

  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // ตรวจสอบข้อมูล
    if (!billingDetails.name.trim()) {
      toast.error("กรุณากรอกชื่อบนบัตร");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              address: {
                postal_code: billingDetails.postalCode || undefined,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error);
        
        // แปล error message เป็นภาษาไทย
        let errorMessage = error.message;
        if (error.code === "card_declined") {
          errorMessage = "บัตรของคุณถูกปฏิเสธ กรุณาลองใช้บัตรใบอื่น";
        } else if (error.code === "insufficient_funds") {
          errorMessage = "บัตรของคุณมียอดเงินไม่เพียงพอ";
        } else if (error.code === "expired_card") {
          errorMessage = "บัตรของคุณหมดอายุแล้ว";
        } else if (error.code === "incorrect_cvc") {
          errorMessage = "รหัส CVV ไม่ถูกต้อง";
        } else if (error.code === "processing_error") {
          errorMessage = "เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง";
        }

        toast.error(errorMessage);
      } else if (paymentIntent.status === "succeeded") {
        // console.log("💳 Payment succeeded! PaymentIntent ID:", paymentIntent.id);
        toast.success("ชำระเงินสำเร็จ! กำลังดำเนินการ...");
        
        // เรียก API เพื่อ confirm payment 
        try {
          const response = await confirmStripePayment(token, paymentIntent.id);
        } catch (confirmError) {
          console.error(" Error confirming payment:", confirmError);
          console.error("Error details:", confirmError.response?.data);
          // ไม่ต้อง show error เพราะ webhook อาจทำงานอยู่
        }
        
        // Navigate ไปหน้า success
        setTimeout(() => {
          navigate(`/payment/success?orderId=${orderId}&paymentId=${paymentId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error("เกิดข้อผิดพลาดในการชำระเงิน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* แสดงยอดเงิน */}
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">ยอดชำระทั้งหมด</span>
          <span className="text-2xl font-bold text-indigo-600">
            ฿{parseFloat(amount).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* คำอธิบาย */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ข้อมูลบัตรเครดิต/บัตรเดบิตของคุณจะถูกเข้ารหัสอย่างปลอดภัยผ่าน{" "}
          <strong>Stripe</strong> โดยทางเราจะไม่มีการบันทึกข้อมูลบัตรของคุณไว้ในระบบ
        </p>
      </div>

      {/* ชื่อบนบัตร */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          ชื่อบนบัตร
        </label>
        <input
          type="text"
          name="name"
          value={billingDetails.name}
          onChange={handleChange}
          placeholder="JOHN DOE"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        />
      </div>

      {/* หมายเลขบัตร */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <CreditCard className="inline-block w-4 h-4 mr-2" />
          หมายเลขบัตร
        </label>
        <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-white">
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* วันหมดอายุและ CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            วันหมดอายุ(MM/YY)
          </label>
          <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-white">
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Lock className="inline-block w-4 h-4 mr-2" />
            CVV
          </label>
          <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-white">
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {/* รหัสไปรษณีย์ (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          รหัสไปรษณีย์ของบัตร (ถ้ามี)
        </label>
        <input
          type="text"
          name="postalCode"
          value={billingDetails.postalCode}
          onChange={handleChange}
          placeholder="12345"
          maxLength="5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* ปุ่มชำระเงิน */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/checkout")}
          disabled={loading}
          className="flex-1"
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              กำลังดำเนินการ...
            </span>
          ) : (
            `ชำระเงิน ฿${parseFloat(amount).toLocaleString("th-TH")}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default StripeCheckoutForm;
