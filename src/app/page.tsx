import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Programs from "@/components/home/Programs";
import Testimonials from "@/components/home/Testimonials";
import Checkout from "@/components/Pricing/Payment";

export default async function HomePage() {
  const planId = "68bfb6d2024e3cc6dbfdce1b";

  // backend se order create kar raha hai
  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
    cache: "no-store", // force fresh request
  });

  const order = await res.json();

  return (
    <main>
      <Hero />
      {/* ✅ orderId aur amount pass kar rahe ho */}
      <Checkout orderId={order.id} amount={order.amount} />
      <Features />
      <Programs />
      <Testimonials />
    </main>
  );
}
