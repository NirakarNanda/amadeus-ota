"use client";
import axios from "axios";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PaymentSuccess(
  { searchParams: { amount, offerId }, }:
    {
      searchParams: { amount: string; offerId: string };
    }) {

  const [successResponse, setSuccessResponse] = useState<any>();

  useEffect(() => {
    const handleBookingRequest = async () => {
      const payload = {
        data: {
          type: "hotel-order",
          guests: [
            {
              tid: 1,
              title: "MR",
              firstName: "BOB",
              lastName: "SMITH",
              phone: "+33679278416",
              email: "bob.smith@email.com",
            },
          ],
          travelAgent: {
            contact: {
              email: "bob.smith@email.com",
            },
          },
          roomAssociations: [
            {
              guestReferences: [{ guestReference: "1" }],
              hotelOfferId: offerId,
            },
          ],
          payment: {
            method: "CREDIT_CARD",
            paymentCard: {
              paymentCardInfo: {
                vendorCode: "VI",
                cardNumber: "4151289722471370",
                expiryDate: "2026-08",
                holderName: "BOB SMITH",
              },
            },
          },
        },
      };

      try {
        const response = await axios.post("http://localhost:8080/api/v1/amadeus/booking/hotels-orders", payload);
        console.log("Book Response --------------------->", response);

        if (response.status === 200) {
          setSuccessResponse(response?.data?.data.hotelBookings[0]);
        } else {
          console.log("Failed to complete the booking. Please try again later.");
        }
      } catch (error: any) {
        window.location.reload();
        console.error("Booking Error:", error);
      }
    };

    handleBookingRequest();
  }, [amount, offerId]);

  if (!successResponse) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Blurred bubbles */}
        <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-20 left-10 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-blob animation-delay-2000"></div>

        {/* Loading card */}
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-1/3 mx-auto text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-white">Processing your booking...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Blurred bubbles */}
      <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-20 left-10 animate-blob"></div>
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-blob animation-delay-2000"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full">

      <div className="text-left md:w-1/3 w-full mx-4 mt-6 md:mt-0">
          <svg
            className="w-24 h-24 text-green-500 mx-auto animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
              className="text-green-500"
            />
          </svg>
          <h1 className="text-4xl font-extrabold text-white mt-6">Thank you for your booking!</h1>
          <p className="text-lg text-gray-200 mt-4">We’ve received your payment of <span className="font-semibold">${amount}</span> and your booking has been confirmed. You will receive an email with the booking details shortly.</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg mx-4">
          <h2 className="text-2xl font-bold text-gray-100 text-left mb-4">Booking Details</h2>
          <p className="text-lg text-gray-200">Amount Paid: <span className="font-semibold">${amount}</span></p>
          <p className="text-lg text-gray-200">Booking Status: <span className="font-semibold">{successResponse?.bookingStatus}</span></p>
          <p className="text-lg text-gray-200">Hotel Name: <span className="font-semibold">{successResponse?.hotel?.name}</span></p>
        </div>

        
      </div>

      {/* Add the style here inside the return */}
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
    </main>
  );
}