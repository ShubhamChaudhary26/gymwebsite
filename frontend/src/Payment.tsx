"use client";
import Script from "next/script";

export default function Checkout({ orderId, amount }: { orderId: string; amount: number }) {
  const pay = () => {
    

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: amount, // paise me
      currency: "INR",
      name: "My Gym",
      description: "Monthly Plan",
      order_id: orderId, // backend se aaya hua orderId
      handler: async function (response: any) {
        console.log("✅ Razorpay response:", response);
        // isme ab teen fields aani chahiye:
        // razorpay_payment_id, razorpay_order_id, razorpay_signature

        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
if (!orderId) {
      alert("❌ Order ID missing!");
      return;
    }
        const data = await res.json();
        alert("Payment Verify Response: " + JSON.stringify(data));
      },
      prefill: {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        contact: "9876543210",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={pay}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Pay Now
      </button>
    </>
  );
}
