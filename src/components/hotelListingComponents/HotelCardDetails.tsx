import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import image1 from "../assets/amadeus-property/p1.jpg";
import image2 from "../assets/amadeus-property/p2.jpg";
import image3 from "../assets/amadeus-property/p3.jpg";
import image4 from "../assets/amadeus-property/p4.jpg";
import image5 from "../assets/amadeus-property/p5.jpg";
import image6 from "../assets/amadeus-property/p6.jpg";
import image7 from "../assets/amadeus-property/p7.jpg";
import image8 from "../assets/amadeus-property/p8.jpg";
import image9 from "../assets/amadeus-property/p9.jpg";
import image10 from "../assets/amadeus-property/p10.jpg";
import image11 from "../assets/amadeus-property/p11.jpg";
import image12 from "../assets/amadeus-property/p12.jpg";
import image13 from "../assets/amadeus-property/p13.jpg";
import image14 from "../assets/amadeus-property/p14.jpg";
import { reverseGeocode } from "@/utils/geoCoding";

// Types and Interfaces
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
  description?: string;
  image?: string[];
  amenities?: string[];
  star_rating?: string;
}

interface LocationDetails {
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
  street: string;
}

interface HotelCardDetailsProps {
  hotelData: HotelData;
}

const HotelCardDetails: React.FC<HotelCardDetailsProps> = ({ hotelData }) => {
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Default amenities if none provided
  const defaultAmenities = [
    "WiFi",
    "Air Conditioning",
    "Room Service",
    "Restaurant",
    "Parking",
  ];

  // All available images
  const images = [
    image1, image2, image3, image4, image5, image6, image7, 
    image8, image9, image10, image11, image12, image13, image14
  ];

  // Initialize random image on component mount
  useEffect(() => {
    // Fisher-Yates Shuffle
    const shuffledImages = [...images];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }
    setSelectedImage(shuffledImages[0]);
  }, []);

  // Fetch location details
  // useEffect(() => {
  //   const fetchLocationDetails = async () => {
  //     setIsLoading(true); // Set loading state to true
  //     try {
  //       const details = await reverseGeocode(
  //         hotelData.geoCode.latitude,
  //         hotelData.geoCode.longitude
  //       );
  //       setLocationDetails(details);
  //     } catch (error) {
  //       console.error("Error fetching location details:", error);
  //     } finally {
  //       setIsLoading(false); // Set loading state to false regardless of success or failure
  //     }
  //   };

  //   fetchLocationDetails();
  // }, [hotelData.geoCode.latitude, hotelData.geoCode.longitude]);

  // Format address using either geocoded data or fallback
  const formatAddress = (address: Address) => {
    if (locationDetails?.formattedAddress) {
      return locationDetails.formattedAddress;
    }
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.stateCode) parts.push(address.stateCode);
    if (address.postalCode) parts.push(address.postalCode);
    return parts.join(", ");
  };

  // Loading state
  if (!selectedImage) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
  }

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      {/* Image Section */}
      <div className="sm:w-2/5 relative h-64 sm:h-auto">
        <Image
          src={selectedImage || "/api/placeholder/400/320"}
          alt={hotelData.name}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
        />
      </div>

      {/* Content Section */}
      <div className="sm:w-3/5 flex flex-col p-4">
        {/* Header */}
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{hotelData.name}</CardTitle>
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

        {/* Content */}
        <CardContent className="p-0 mb-4">
          {/* Distance Info */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">
            Located {hotelData.distance.value.toFixed(2)} {hotelData.distance.unit} from city center
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(hotelData.amenities || defaultAmenities).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Address Details */}
          <div className="text-xs space-y-1">
            <p className="font-medium text-gray-700">
              Country: {locationDetails?.country || hotelData.address?.countryCode}
            </p>
            <p className="text-gray-600">
              {isLoading ? "Loading address..." : formatAddress(hotelData.address)}
            </p>
            <p className="text-gray-500">
              Coordinates: {hotelData.geoCode.latitude.toFixed(6)}, {hotelData.geoCode.longitude.toFixed(6)}
            </p>
          </div>
        </CardContent>

        {/* Footer */}
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
            <span className="text-gray-500 text-sm">Last updated: {hotelData.lastUpdate}</span>
          </div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">Book Now</button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default HotelCardDetails;
