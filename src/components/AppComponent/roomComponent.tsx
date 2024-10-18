"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaStar, FaWifi, FaSnowflake, FaKitchenSet, FaFireFlameCurved } from "react-icons/fa6";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from "@/components/ui/modal/Modal"; // Assuming you have a Modal component
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

// Define interfaces for type safety
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

// API function to fetch hotel offers
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

// Main component
const RoomsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const checkInDate = searchParams.get("checkIn") || "2024-11-20"; // Default check-in date
  const adults = Number(searchParams.get("adults")) || 1; // Default adults

  // State management
  const [hotelOffers, setHotelOffers] = useState<HotelOffersResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<HotelOffer["offers"][0] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Check user login status

  // Fetch hotel offers
  useEffect(() => {
    const fetchHotelOffers = async () => {
      if (!propertyId) return;

      setIsLoading(true);
      try {
        const response = await getMultiHotelOffer(propertyId, adults, checkInDate);
        console.log("Hotel offers:", response);
        setHotelOffers(response);
        
        // Simulate checking login status (you can use real logic here, like checking tokens)
        const userLoggedIn = true; // Replace this with actual login status check
        setIsLoggedIn(userLoggedIn);
      } catch (error) {
        console.error("Error fetching hotel offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelOffers();
  }, [propertyId, adults, checkInDate]);

  // Function to handle booking now
  const handleBookNow = (offer: HotelOffer["offers"][0]) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      router.push("/login");
    } else {
      // Open modal if logged in
      setSelectedOffer(offer);
      setIsModalOpen(true);
    }
  };

  // Function to proceed with booking
  const confirmBooking = () => {
    if (selectedOffer) {
      // router.push(`/booking/${hotelOffers?.data[0].hotel.hotelId}/${selectedOffer.id}`);
      router.push(`/payment?amount=${selectedOffer.price.total}&offerId=${selectedOffer.id}&currency=${selectedOffer.price.currency}`);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      {/* Header section */}
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

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-300 h-96 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {/* No offers available state */}
      {!isLoading && (!hotelOffers?.data[0]?.offers || hotelOffers.data[0].offers.length === 0) && (
        <p className="text-center text-xl">No rooms available for these dates.</p>
      )}

      {/* Room cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelOffers?.data[0]?.offers.map((offer) => (
          <RoomCard 
            key={offer.id} 
            offer={offer}
            hotelId={hotelOffers.data[0].hotel.hotelId}
            onBookNow={() => handleBookNow(offer)} // Pass the handler
          />
        ))}
      </div>

{/* Modal for booking confirmation */}
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

// RoomCard component
const RoomCard: React.FC<{ 
  offer: HotelOffer["offers"][0];
  hotelId: string;
  onBookNow: () => void; // Accept book now handler as prop
}> = ({ offer, hotelId, onBookNow }) => {
  // Helper function to get room amenities based on room type
  const getRoomAmenities = (roomType: string) => {
    const defaultAmenities = [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaSnowflake />, name: "Air Conditioning" },
      { icon: <FaKitchenSet />, name: "Mini Bar" },
      { icon: <FaFireFlameCurved />, name: "Heating" },
    ];
    return defaultAmenities;
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative w-full h-48">
        <Image
          priority
          src="/api/placeholder/400/300"
          alt="Room image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl text-blue-600">
          {offer.room.typeEstimated.category} - {offer.room.typeEstimated.bedType}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {offer?.room?.description?.text}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          {getRoomAmenities(offer.room.type).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-sm text-red-600">
              {amenity.icon}
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center text-yellow-500 mb-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div className="text-lg font-bold text-gray-800">
          {offer.price.currency} {offer.price.total}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Policies: {offer?.policies?.paymentType}</p>
        <button
          onClick={onBookNow} // Trigger book now handler
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
        >
          Book Now
        </button>
      </CardFooter>
    </Card>
  );
};

export default RoomsPage;
