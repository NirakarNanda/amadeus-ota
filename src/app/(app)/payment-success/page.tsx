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
        // Make the booking request to your backend
        const response = await axios.post("http://localhost:8080/api/v1/amadeus/booking/hotels-orders", payload);
        console.log("Book Response --------------------->", response);

        if (response.status === 200) {
          // toast.success("Booking successful");
          setSuccessResponse(response?.data?.data.hotelBookings[0]);
        }
        else {
          // toast.error("Failed to complete the booking. Please try again later.");
          console.log("Failed to complete the booking. Please try again later.");
        }
        // If booking is successful, redirect to the success page
        // router.push(`/payment-success?amount=${amount}`);
      } catch (error: any) {
        console.error("Booking Error:", error);
        // toast.error(error.response.data.error[0].title);
        // setErrorMessage("Failed to complete the booking. Please try again later.");
      }
    };

    handleBookingRequest();
  }, [amount, offerId]);


  if (!successResponse) {
    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Loading..</h1>
          {/* <h2 className="text-2xl text-gray-200">You successfully sent</h2> */}
        </div>
      </main>
    )
  }



  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl text-gray-200">You successfully sent</h2>

        {
          (successResponse === undefined && successResponse === null) ?
            <div>Loading..</div> :
            <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-2xl font-bold">
              <p>Amount: {amount}</p>
              <p>Status: {successResponse?.bookingStatus}</p>
              <p>Hotel Name: {successResponse?.hotel?.name}</p>
            </div>
        }
      </div>
    </main>
  );
}