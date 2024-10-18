"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/ui/modal/Modal";
import axios from "axios";
import { RoomCard } from "./RoomCard";

interface HotelOffer {
  type: string;
  hotel: {
    hotelId: string;
    name: string;
    cityCode: string;
  };
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
        lang: string;
      };
    };
    price: {
      currency: string;
      base: string;
      total: string;
    };
    policies: {
      cancellations: Array<{
        description: {
          text: string;
        };
        type: string;
      }>;
      paymentType: string;
    };
  }>;
}

interface HotelOffersResponse {
  data: HotelOffer[];
}

const getMultiHotelOffer = async (hotelId: string, adults: number, checkIn: string) => {
  try {
    const result = await axios.get(
      `http://localhost:8080/api/v1/amadeus/shopping-/hotels-offer?hotelId=${hotelId}&adults=${adults}&checkIn=${checkIn}`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching hotel offers:", error);
    throw error;
  }
};

const RoomsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const checkInDate = searchParams.get("checkin") || "2024-10-17";
  const adults = Number(searchParams.get("adults")) || 1;

  const [hotelOffers, setHotelOffers] = useState<HotelOffersResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<HotelOffer["offers"][0] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchHotelOffers = async () => {
      if (!propertyId) return;

      setIsLoading(true);
      try {
        const response = await getMultiHotelOffer(propertyId, adults, checkInDate);
        console.log("Hotel offers:", response);
        setHotelOffers(response);
        const userLoggedIn = true;
        setIsLoggedIn(userLoggedIn);
      } catch (error) {
        console.error("Error fetching hotel offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelOffers();
  }, [propertyId, adults, checkInDate]);

  const handleBookNow = (offer: HotelOffer["offers"][0]) => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setSelectedOffer(offer);
      setIsModalOpen(true);
    }
  };

  const confirmBooking = () => {
    if (selectedOffer) {
      router.push(`/booking/${hotelOffers?.data[0].hotel.hotelId}/${selectedOffer.id}`);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-6 p-4">
        <h1 className="text-2xl font-semibold text-gray-800">Available Rooms</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            <span>{hotelOffers?.data[0]?.offers?.length || 0} results</span>
          </div>
          <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            <span>{checkInDate}</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-300 h-96 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {!isLoading && (!hotelOffers?.data[0]?.offers || hotelOffers.data[0].offers.length === 0) && (
        <p className="text-center text-xl">No rooms available for these dates.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelOffers?.data[0]?.offers.map((offer) => (
          <RoomCard 
            key={offer.id} 
            offer={offer}
            hotelId={hotelOffers.data[0].hotel.hotelId}
            onBookNow={() => handleBookNow(offer)}
          />
        ))}
      </div>

      {isModalOpen && selectedOffer && (
        <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>
            <p>Room: {selectedOffer.room.typeEstimated.category}</p>
            <p>Price: {selectedOffer.price.currency} {selectedOffer.price.total}</p>
            <div className="flex justify-end mt-4">
              <button 
                onClick={confirmBooking} 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                Book Now
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoomsPage;