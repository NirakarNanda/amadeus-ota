"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Header from "@/components/hotelListingComponents/roomAmenities";
import HotelCardDetails from "@/components/hotelListingComponents/HotelCardDetails";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import 'regenerator-runtime/runtime';
import toast from "react-hot-toast";
import axios from 'axios'; // Import axios for the Amadeus API call
import { getHotelsByCity, getHotelById } from '@/api/hotel';

export type Hotel = {
  _id: string;
  user_id?: string;
  property_name: string;
  property_email: string;
  property_contact: string;
  description: string;
  image: string[];
  isDraft: boolean;
  property_address?: {
    city: string;
    country: string;
    state: string;
    street: string;
    zip: string;
  };
  property_amenities: string;
  property_category: string;
  property_code: string;
  property_room: string[];
  property_type: string;
  rate_plan: string;
  room_Aminity: string;
  star_rating: string;
  __v: number;
  [key: string]: any;
};

const HotelList: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [params, setParams] = useState<{ location?: string; destination?: string; url?: string }>({});
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [errorToastShown, setErrorToastShown] = useState<boolean>(false);

  const destination = searchParams.get("destination");
  const location = searchParams.get("location");

  useEffect(() => {
    if (location) {
      setParams({ location, url: "search" });
    } else if (destination) {
      setParams({ destination, url: "search-amenities" });
    }
  }, [destination, location]);

  useEffect(() => {
    if (params.location) {
      fetchHotels(params.location);
    } else if (params.destination) {
      fetchHotels(params.destination);
    }
  }, [params]);

  const fetchHotels = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    setErrorToastShown(false);

    try {
      const hotelsResponse = await getHotelsByCity(searchTerm);
      const hotels = hotelsResponse.data;
      
      // Fetch detailed information for each hotel
      const detailedHotels = await Promise.all(
        hotels.map(async (hotel: any) => {
          const detailedHotel = await getHotelById(hotel.hotelId);
          return { ...hotel, ...detailedHotel.data };
        })
      );

      setAllHotels(detailedHotels);
      setFilteredHotels(detailedHotels);
      
      if (detailedHotels.length === 0) {
        toast.error('No hotels found for the given search criteria.');
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An unknown error occurred"));
      setAllHotels([]);
      setFilteredHotels([]);
      console.error("Error fetching hotels:", error);

      if (!errorToastShown) {
        toast.error('Something went wrong, please try again later.');
        setErrorToastShown(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoadingSkeleton = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-8 bg-gray-200 rounded-lg shadow-md p-4 animate-pulse">
          <div className="flex">
            <div className="w-1/3 h-48 bg-gray-300 rounded-lg mr-4"></div>
            <div className="w-2/3">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-20 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  
  const renderHotels = () => {
    if (isLoading) return renderLoadingSkeleton();

    if (error) {
      return <div className="text-center py-8">Something went wrong, please try again later.</div>;
    }

    if (!isLoading && filteredHotels.length === 0) {
      return <div className="text-center py-8">No hotels found for the given search criteria. Please try a different search.</div>;
    }

    return filteredHotels.map((hotel: Hotel, index: number) => (
      <Link href={`/hotel?id=${hotel.hotelId}`} key={`${hotel.hotelId}-${index}`} passHref>
        <div className="mb-8 transition-all duration-300 ease-in-out transform hover:scale-105">
          <HotelCardDetails hotelData={hotel} key={""} />
        </div>
      </Link>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header tag={`All hotels in ${location || destination}`} />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <p className="text-gray-500 text-lg mb-4">{filteredHotels.length} stays in {location || destination}</p>
          {renderHotels()}
        </div>
        <div className="lg:w-1/3">
          <div className="lg:sticky lg:top-0">
            <Card>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                {filteredHotels.length > 0 ? <p>Map Placeholder</p> : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;