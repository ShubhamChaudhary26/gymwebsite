"use client";
import Script from "next/script";

type CheckoutProps = {
  orderId: string;
  amount: number;
};

export default function Checkout({ orderId, amount }: CheckoutProps) {
  const pay = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      name: "My Gym",
      description: "Monthly Plan",
      order_id: orderId,
      handler: async function (response: any) {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const data = await res.json();
        alert("Payment: " + JSON.stringify(data));
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
      <button onClick={pay}>Pay Now</button>
    </>
  );
}
