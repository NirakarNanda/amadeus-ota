"use client";

import CheckAuthentication from "@/components/check_authentication/CheckAuth";
import CheckoutPage from "@/components/Stripe/checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function PaymentPageContent() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const authUser = useSelector((state: any) => state.authReducer.user);
  
  const amount = parseInt(searchParams.get("amount") || "0", 10);
  const offerId = searchParams.get("offerId");
  const currency = searchParams.get("currency")?.toLowerCase();
  const firstName = authUser?.firstName;
  const lastName = authUser?.lastName;
  const email = authUser?.email;

  // Add a loading or error state handler
  if (!searchParams || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-xl">Invalid payment information</div>
      </div>
    );
  }

  return (
    <CheckAuthentication setLoading={setLoading}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 sm:p-8 md:p-12 flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        </div>

        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl border border-white/20 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-medium text-white/80">Amount to Pay</h2>
                  <div className="mt-2 flex items-center justify-center md:justify-start">
                    <span className="text-5xl font-bold text-white">
                      {currency?.toUpperCase() || 'USD'} {amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-3 text-white/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure Payment Processing</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 Support Available</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-white/70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secured by Stripe</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl border border-white/20">
              <h2 className="text-2xl font-medium text-white mb-6">Payment Details</h2>
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubcurrency(amount),
                  currency: `${currency || "USD"}`,
                }}
              >
                <CheckoutPage 
                  amount={amount} 
                  offerId={offerId as string} 
                  currency={currency as string}
                  firstName={firstName as string}
                  lastName={lastName as string}
                  email={email as string}
                />
              </Elements>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-white/60 text-sm">
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </CheckAuthentication>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-xl">Loading payment information...</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}