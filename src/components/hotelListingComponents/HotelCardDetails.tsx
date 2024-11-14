import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star, Clock } from "lucide-react";
import Image from "next/image";
import image1 from "../assets/amadeus-property/p1.jpg";
import image2 from "../assets/amadeus-property/p2.jpg";
import image3 from "../assets/amadeus-property/p3.jpg";
import image4 from "../assets/amadeus-property/p4.jpg";

interface GeoCode {
  latitude: number;
  longitude: number;
}

interface Address {
  countryCode: string;
  street?: string;
  city?: string;
  postalCode?: string;
  stateCode?: string;
}

interface Distance {
  value: number;
  unit: string;
}

interface HotelData {
  name: string;
  hotelId: string;
  geoCode: GeoCode;
  address: Address;
  distance: Distance;
  lastUpdate: string;
  star_rating?: string;
}

interface LocationDetails {
  formattedAddress: string;
  country: string;
}

interface HotelCardDetailsProps {
  hotelData: HotelData;
}

const HotelCardDetails: React.FC<HotelCardDetailsProps> = ({ hotelData }) => {
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(image1);

  const images = [image1, image2, image3, image4];

  // Initialize random image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${hotelData.geoCode.latitude}&lon=${hotelData.geoCode.longitude}&zoom=18&addressdetails=1`
        );
        if (!response.ok) throw new Error("Failed to fetch address");

        const data = await response.json();
        setLocationDetails({
          formattedAddress: data.display_name,
          country: data.address.country || hotelData.address.countryCode || "",
        });
      } catch (err) {
        setError("Unable to fetch location details");
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelData.geoCode.latitude && hotelData.geoCode.longitude) {
      fetchAddress();
    }
  }, [hotelData.geoCode.latitude, hotelData.geoCode.longitude]);

  return (
    <Card className="w-full  mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-64 md:h-auto w-full">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={hotelData.name}
              layout="fill"
              objectFit="cover"
              priority
              className="rounded-t-lg md:rounded-l-lg"
            />
          ) : (
            <div className="animate-pulse bg-gray-200 h-full w-full" />
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-4">
          {/* Header */}
          <CardHeader className="p-0 mb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                {hotelData.name}
              </CardTitle>
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold text-blue-900">
                  {hotelData.star_rating || "4.5"}
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Distance */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <p>{hotelData.distance.value.toFixed(1)} {hotelData.distance.unit} from city center</p>
          </div>

          {/* Address */}
          <CardContent className="p-0 text-gray-600 text-sm space-y-2">
            {isLoading ? (
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            ) : (
              <p>{locationDetails?.formattedAddress || "Address unavailable"}</p>
            )}
            <p>
              Country: {locationDetails?.country || hotelData.address.countryCode}
            </p>
          </CardContent>

          {/* Footer */}
          <CardFooter className="p-0 mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
  <div className="flex items-center text-xs text-gray-500">
    <Clock className="w-4 h-4 mr-2" />
    <span>Updated: {hotelData.lastUpdate}</span>
  </div>
  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg transition-colors duration-200">
    Book Now
  </button>
</CardFooter>

        </div>
      </div>
    </Card>
  );
};

export default HotelCardDetails;
