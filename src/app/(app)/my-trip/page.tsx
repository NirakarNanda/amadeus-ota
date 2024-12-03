"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from '@/Redux/store';

// Typescript interface for booking
interface Booking {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  confirmationNumber: string;
  total: number;
  currency: string;
  roomQuantity: number;
  method: string;
  createdAt: string;
  hotel: {
    id: string;
    name: string;
    chainCode: string;
  };
  guests: Array<{
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }>;
  paymentCard?: {
    vendorCode: string;
    cardNumber: string;
    expiryDate: string;
    holderName: string;
  };
}

export default function BookingTabs() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user from Redux store
  const authUser = useSelector((state: any) => state.authReducer.user);
  const token = Cookies.get('accessToken');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/bookings/users?id=${authUser?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("There is no booking");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to mask card number
  const maskCardNumber = (cardNumber?: string) => {
    return cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 text-xl p-10 bg-gray-100 rounded-lg">
          No bookings found
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{booking.hotel.name}</h2>
                    <p className="text-sm text-gray-500">Confirmation: {booking.confirmationNumber}</p>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-semibold 
                    bg-green-100 text-green-800"
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p className="mb-2">
                      <span className="font-semibold">Booked on:</span> {formatDate(booking.createdAt)}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Total Cost:</span> {booking.total} {booking.currency}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Payment Method:</span> {booking.method}
                    </p>
                    {booking.paymentCard && (
                      <p>
                        <span className="font-semibold">Card:</span> {maskCardNumber(booking.paymentCard.cardNumber)}
                      </p>
                    )}
                  </div>
                  <div>
                    {booking.guests.length > 0 && (
                      <div>
                        {booking.guests.map((guest, index) => (
                          <p key={index} className="text-sm">
                            {guest.title} {guest.firstName} {guest.lastName}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}