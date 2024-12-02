// "use client";

// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import toast from "react-hot-toast";
// import Cookies from "js-cookie";
// import { buildHotelBookingPayload } from "@/utils/bookingPayloadBuilder";

// type TSearchParamsType = {
//   amount: string;
//   offerId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// };

// export default function PaymentSuccess({
//   searchParams: { amount, offerId, firstName, lastName, email },
// }: {
//   searchParams: TSearchParamsType;
// }) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [successResponse, setSuccessResponse] = useState<any>(null);
//   const isRequestSent = useRef(false);
//   const token = Cookies.get("accessToken");

//   useEffect(() => {
//     if (!amount || !offerId || !firstName || !lastName || !email || isRequestSent.current) return;

//     const handleBooking = async () => {
//       const guestInfo = { firstName, lastName, email };

//       const payload = buildHotelBookingPayload({
//         offerId,
//         guestInfo,
//       });

//       try {
//         setIsLoading(true);
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/booking/hotels-orders`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status === 200) {
//           setSuccessResponse(response.data.data.hotelBookings[0]);
//           isRequestSent.current = true;
//         } else {
//           toast.error("Booking failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Booking Error:", error);
//         toast.error("An error occurred while processing your booking.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     handleBooking();
//   }, [amount, offerId, firstName, lastName, email, token]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
//         <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-20 left-10 animate-blob"></div>
//         <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-blob animation-delay-2000"></div>
//         <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-1/3 mx-auto text-center">
//           <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-lg text-white">Processing your booking...</p>
//         </div>
//       </main>
//     );
//   }

//   if (!successResponse) {
//     return (
//       <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
//         <p className="text-white">An error occurred while booking your hotel. Please try again.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
//       <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-20 left-10 animate-blob"></div>
//       <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-blob animation-delay-2000"></div>

//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full">
//         <div className="text-left md:w-1/3 w-full mx-4 mt-6 md:mt-0">
//           <svg
//             className="w-24 h-24 text-green-500 mx-auto animate-bounce"
//             fill="none"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="4" />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12l2 2 4-4"
//               className="text-green-500"
//             />
//           </svg>
//           <h1 className="text-4xl font-extrabold text-white mt-6">Thank you for your booking!</h1>
//           <p className="text-lg text-gray-200 mt-4">
//             We’ve received your payment of <span className="font-semibold">${amount}</span> and your
//             booking has been confirmed. You will receive an email with the booking details shortly.
//           </p>
//         </div>

//         <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg mx-4">
//           <h2 className="text-2xl font-bold text-gray-100 text-left mb-4">Booking Details</h2>
//           <p className="text-lg text-gray-200">
//             Amount Paid: <span className="font-semibold">${amount}</span>
//           </p>
//           <p className="text-lg text-gray-200">
//             Booking Status: <span className="font-semibold">{successResponse?.bookingStatus}</span>
//           </p>
//           <p className="text-lg text-gray-200">
//             Hotel Name: <span className="font-semibold">{successResponse?.hotel?.name}</span>
//           </p>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </main>
//   );
// }



// /pages/payment-success.jsx

// /pages/payment-success.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { buildHotelBookingPayload } from "@/utils/bookingPayloadBuilder";
import { makeBookingRequest } from "@/api/booking";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import BookingDetails from "@/components/bookingComponents/BookingDetails";


type TSearchParamsType = {
  amount: string;
  offerId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function PaymentSuccess({ searchParams: { amount, offerId, firstName, lastName, email } }: { searchParams: TSearchParamsType }) {
  const [booking, setBooking] = useState(null);
  const isRequestSent = useRef(false);

  useEffect(() => {
    if (!amount || !offerId || !firstName || !lastName || !email || isRequestSent.current) return;

    const handleBooking = async () => {
      const token = Cookies.get("accessToken");
      const guestInfo = { firstName, lastName, email };

      const payload = buildHotelBookingPayload({ offerId, guestInfo });

      try {
        isRequestSent.current = true;
        const response = await makeBookingRequest(payload, token as string);
        setBooking(response);
        toast.success("Booking confirmed!");
      } catch (error) {
        console.error("Booking Error:", error);
        toast.error("Failed to complete booking. Please try again.");
      }
    };

    handleBooking();
  }, [amount, offerId, firstName, lastName, email]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-20 left-10 animate-blob"></div>
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-blob animation-delay-2000"></div>
      {booking ? (
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full">
          <div className="text-left md:w-1/3 w-full mx-4 mt-6 md:mt-0">
            <svg className="w-24 h-24 text-green-500 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" className="text-green-500" />
            </svg>
            <h1 className="text-4xl font-extrabold text-white mt-6">Thank you for your booking!</h1>
            <p className="text-lg text-gray-200 mt-4">We've received your payment of <span className="font-semibold">${amount}</span> and your booking has been confirmed.</p>
          </div>
          <BookingDetails booking={booking} amount={amount} />
        </div>
      ) : (
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-1/3 mx-auto text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-white">Processing your booking...</p>
        </div>
      )}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </main>
  );
}