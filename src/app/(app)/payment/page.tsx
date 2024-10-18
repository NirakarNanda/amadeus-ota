"use client";

import CheckoutPage from "@/components/Stripe/checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = parseInt(useSearchParams().get("amount") || "0", 10);
  const offerId = useSearchParams().get("offerId");
  const currency = useSearchParams().get("currency")?.toLowerCase();

  console.log("Currency ------------------>", currency)

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Requested Amount</h1>
        <h2 className="text-2xl">
          {/* has requested */}
          <span className="font-bold text-gray-200"> ${amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: `${currency || "USD"}`,
          // currency: "inr"
        }}
      >
        <CheckoutPage amount={amount} offerId={offerId as string} currency={currency as string}/>
      </Elements>
    </main>
  );
}