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
        console.error("Booking Error:", error);
      }
    };

    handleBookingRequest();
  }, [amount, offerId]);

  if (!successResponse) {
    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-green-400 to-blue-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Loading..</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-green-400 to-blue-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl text-gray-200">Your booking was successful!</h2>
        
        <div className="flex justify-center items-center mt-5">
          <svg
            className="w-12 h-12 text-white animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
              className="text-green-500"
            />
          </svg>
        </div>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-2xl font-bold">
          <p>Amount: {amount}</p>
          <p>Status: {successResponse?.bookingStatus}</p>
          <p>Hotel Name: {successResponse?.hotel?.name}</p>
        </div>
      </div>
    </main>
  );
}
