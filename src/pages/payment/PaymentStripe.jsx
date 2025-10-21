import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useSrisiamStore from "../../store/Srisiam-store";
import { createStripePaymentIntent } from "../../api/Payment";
import BreadcrumbsPayment from "../../components/paymentQR/BreadcrumbsPayment";
import StripeCheckoutForm from "../../components/payment/StripeCheckoutForm";
import { toast } from "sonner";

// โหลด Stripe Publishable Key จาก environment variable
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51SKahaLESSghixQPA1fNss3LnUqDyVsZsRCCGdPNgnQDfuuii6hiuhYKgPPu8MpA7sXolJTtUQR23M8Na6c9DdxB009fOrkKpz"
);

const PaymentStripe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(true);

  const token = useSrisiamStore((state) => state.token);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (!orderId || !amount) {
      toast.error("ข้อมูลการชำระเงินไม่ครบถ้วน");
      navigate("/cart");
      return;
    }

    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบ");
      navigate("/login");
      return;
    }

    createPaymentIntent();
  }, [orderId, amount, token]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await createStripePaymentIntent(token, orderId, amount);

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
        setPaymentId(response.data.paymentId);
      } else {
        toast.error("ไม่สามารถสร้างการชำระเงินได้");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("เกิดข้อผิดพลาดในการเริ่มต้นการชำระเงิน");
      }
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#4F46E5",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BreadcrumbsPayment />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-4 text-gray-600">
                  กำลังเตรียมการชำระเงิน...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbsPayment />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              ชำระเงินด้วยบัตรเครดิต/เดบิต
            </h1>

            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  orderId={orderId}
                  amount={amount}
                  paymentId={paymentId}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStripe;
