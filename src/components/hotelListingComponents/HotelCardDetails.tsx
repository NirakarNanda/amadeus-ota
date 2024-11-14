import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Clock, Wifi, Car, Utensils, Wind, Phone } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // All available images
  const images = [
    image1, image2, image3, image4, image5, image6, image7, 
    image8, image9, image10, image11, image12, image13, image14
  ];

  // Default amenities with icons
  const defaultAmenities = [
    { name: "WiFi", icon: <Wifi className="w-4 h-4" /> },
    { name: "Parking", icon: <Car className="w-4 h-4" /> },
    { name: "Restaurant", icon: <Utensils className="w-4 h-4" /> },
    { name: "AC", icon: <Wind className="w-4 h-4" /> },
    { name: "Room Service", icon: <Phone className="w-4 h-4" /> },
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

  // Geocoding implementation
  useEffect(() => {
    const fetchAddress = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Using Nominatim OpenStreetMap API for geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${hotelData.geoCode.latitude}&lon=${hotelData.geoCode.longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'HotelFinderApp/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }

        const data = await response.json();
        
        setLocationDetails({
          formattedAddress: data.display_name,
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          country: data.address.country || '',
          countryCode: data.address.country_code?.toUpperCase() || '',
          postalCode: data.address.postcode || '',
          street: data.address.road || ''
        });
      } catch (err) {
        setError('Unable to fetch location details');
        console.error('Geocoding error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelData.geoCode.latitude && hotelData.geoCode.longitude) {
      fetchAddress();
    }
  }, [hotelData.geoCode.latitude, hotelData.geoCode.longitude]);

  const formatAddress = () => {
    if (locationDetails?.formattedAddress) {
      return locationDetails.formattedAddress;
    }
    
    if (error || isLoading) {
      return `${hotelData.address.street || ''}, ${hotelData.address.city || ''}, ${hotelData.address.stateCode || ''} ${hotelData.address.postalCode || ''}`.trim();
    }
    
    return 'Address unavailable';
  };

  // Loading state for image
  if (!selectedImage) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-2/5 relative h-64 sm:h-auto">
          <Image
            src={selectedImage}
            alt={hotelData.name}
            layout="fill"
            objectFit="cover"
            priority
            className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
          />
        </div>

        {/* Content Section */}
        <div className="sm:w-3/5 flex flex-col p-6">
          {/* Header */}
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {hotelData.name}
              </CardTitle>
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-lg font-bold text-blue-900">
                  {hotelData.star_rating || "4.5"}
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-0 space-y-4">
            {/* Distance Info */}
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <p className="text-sm">
                {hotelData.distance.value.toFixed(1)} {hotelData.distance.unit} from city center
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              ) : (
                <p className="text-sm text-gray-600">{formatAddress()}</p>
              )}
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-3">
              {(hotelData.amenities || defaultAmenities).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-700"
                >
                  {typeof amenity === 'string' ? (
                    <span>{amenity}</span>
                  ) : (
                    <>
                      {amenity.icon}
                      <span className="ml-2">{amenity.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="p-0 mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Updated: {hotelData.lastUpdate}</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200">
              Book Now
            </button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default HotelCardDetails;