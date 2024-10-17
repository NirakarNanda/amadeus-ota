// components/HotelCardDetails.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { reverseGeocode } from "@/api/reverseGeocode";

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

interface HotelData {
  chainCode: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  geoCode: GeoCode;
  address: Address;
  distance: Distance;
  lastUpdate: string;
  description?: string;
  image?: string[];
  amenities?: string[];
  star_rating?: string;
}

interface HotelCardDetailsProps {
  hotelData: HotelData;
}

const HotelCardDetails: React.FC<HotelCardDetailsProps> = ({ hotelData }) => {
  const [fullAddress, setFullAddress] = useState<string>("Loading address...");
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(true);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const { latitude, longitude } = hotelData.geoCode;
      try {
        const address = await reverseGeocode(latitude, longitude);
        setFullAddress(address);
      } catch (error) {
        setAddressError("Failed to fetch address.");
      } finally {
        setIsAddressLoading(false);
      }
    };

    fetchAddress();
  }, [hotelData.geoCode]);

  // Default amenities that most hotels would have
  const defaultAmenities = [
    "WiFi",
    "Air Conditioning",
    "Room Service",
    "Restaurant",
    "Parking",
  ];

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      <div className="sm:w-2/5 relative h-64 sm:h-auto">
        <Image
          src={hotelData.image?.[0] || "/api/placeholder/400/320"} 
          alt={hotelData.name}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
        />
      </div>
      <div className="sm:w-3/5 flex flex-col p-4">
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">{hotelData.name}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Chain: {hotelData.chainCode} · {hotelData.iataCode}
              </CardDescription>
            </div>
            <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
              <span className="text-lg font-bold text-blue-800 mr-1">
                {hotelData.star_rating || "4.5"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mb-4">
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">
            Located {hotelData.distance.value.toFixed(2)} {hotelData.distance.unit} from city center
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {defaultAmenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            <p>Country: {hotelData.address?.countryCode}</p>
            <p>
              Location:{" "}
              {isAddressLoading ? (
                "Loading address..."
              ) : addressError ? (
                addressError
              ) : (
                fullAddress
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-0 flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-600 text-sm">
              Last updated: {new Date(hotelData.lastUpdate).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">
            View Details
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default HotelCardDetails;
