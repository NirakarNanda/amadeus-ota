"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Header from "@/components/HotelBox/Header";
import HotelCardDetails from "@/components/hotelListingComponents/HotelCardDetails";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { getHotelsByCity } from '@/api/hotel';

interface GeoCode {
  latitude: number;
  longitude: number;
}

interface Address {
  countryCode: string;
}

interface Distance {
  value: number;
  unit: string;
}

interface Hotel {
  chainCode: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  geoCode: GeoCode;
  address: Address;
  distance: Distance;
  lastUpdate: string;
}

interface FilterState {
  amenities: string[];
  priceRange: {
    min: number | undefined;
    max: number | undefined;
  };
  sortOrder: string;
}

const HotelList: React.FC = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<{ location?: string; destination?: string; url?: string }>({});
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [errorToastShown, setErrorToastShown] = useState<boolean>(false);

  const destination = searchParams.get("destination");
  const location = searchParams.get("location");
  const checkinDate = searchParams.get("checkin");

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
      const hotels = hotelsResponse.data as Hotel[];

      setAllHotels(hotels);
      setFilteredHotels(hotels);

      if (hotels.length === 0) {
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

  const handleLocationChange = (newLocation: string) => {
    if (newLocation) {
      setParams({ location: newLocation, url: "search" });
    }
  };

  // const handleFilterChange = (filters: FilterState) => {
  //   let filtered = [...allHotels];

  //   // Apply price filter
  //   if (filters.priceRange.min !== undefined || filters.priceRange.max !== undefined) {
  //     filtered = filtered.filter(hotel => {
  //       // Note: Add price filtering logic based on your hotel data structure
  //       return true; // Placeholder
  //     });
  //   }

  //   // Apply amenities filter
  //   if (filters.amenities.length > 0) {
  //     filtered = filtered.filter(hotel => {
  //       // Note: Add amenities filtering logic based on your hotel data structure
  //       return true; // Placeholder
  //     });
  //   }

  //   // Apply sorting
  //   if (filters.sortOrder) {
  //     filtered.sort((a, b) => {
  //       switch (filters.sortOrder) {
  //         case "price-asc":
  //           // Add price sorting logic
  //           return 0;
  //         case "price-desc":
  //           // Add price sorting logic
  //           return 0;
  //         case "rating":
  //           // Add rating sorting logic
  //           return 0;
  //         default:
  //           return 0;
  //       }
  //     });
  //   }

  //   setFilteredHotels(filtered);
  // };

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
      <Link href={`/hotel?id=${hotel.hotelId}&checkin=${checkinDate}`} key={`${hotel.hotelId}-${index}`} passHref>
        <div className="mb-8 transition-all duration-300 ease-in-out transform hover:scale-105">
          <HotelCardDetails hotelData={hotel} />
        </div>
      </Link>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header 
        onLocationChange={handleLocationChange}
        // onFilterChange={handleFilterChange}
      />
      <div className="mt-8">
        <p className="text-gray-500 text-lg mb-4">{filteredHotels.length} stays in {location || destination}</p>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
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
    </div>
  );
};

export default HotelList;