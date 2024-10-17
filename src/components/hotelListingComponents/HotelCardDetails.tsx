import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../components/ui/card";
import Image from "next/image";
import { Hotel } from "@/components/AppComponent/hotelListing";

interface AmenitiesBasic {
  bed: string;
  bathroom: boolean;
}

interface RoomAmenity {
  amenities?: {
    basic?: AmenitiesBasic;
  };
}

interface PropertyAddress {
  city: string;
  country: string;
  state?: string;
  street?: string;
  zip?: string;
  [key: string]: any;
}

interface PropertyType {
  code: string;
  createdAt: Date;
  name: string;
  propertyCategory: string;
  updatedAt: Date;
  __v: number;
  _id: string;
}

interface PropertyCategory {
  _id: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface HotelData {
  _id: string;
  user_id: string;
  property_name: string;
  property_email: string;
  property_contact: string;
  description: string;
  image: string[];
  isDraft: boolean;
  property_address: PropertyAddress;
  property_amenities: string;
  property_category: PropertyCategory;
  property_code: string;
  property_room: string[];
  property_type: PropertyType;
  rate_plan: string;
  room_Aminity?: RoomAmenity;
  star_rating: string;
  __v: number;
  [key: string]: any;
}

interface HotelCardDetailsProps {
  hotelData: Hotel;
  key: string;
}

const HotelCardDetails: React.FC<HotelCardDetailsProps> = ({ hotelData }) => {
  // Safeguard against missing data
  if (!hotelData) {
    console.error("Invalid hotel data:", hotelData);
    return <div>Error: Invalid hotel data</div>;
  }

  // Normalize the data structure
  const normalizedData = hotelData._source ? hotelData._source : hotelData;

  const trueProperties = Object.entries(normalizedData)
    .filter(([key, value]) => value === true)
    .map(([key]) => key.replace(/_/g, ' '));

  // Define default values in case amenities are not provided
  const amenities = normalizedData.room_Aminity?.amenities?.basic || { bed: "Not specified", bathroom: false };
  const bed = amenities.bed;
  const bathroom = amenities.bathroom ? "Yes" : "No";

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      <div className="sm:w-2/5 relative h-64 sm:h-auto">
        <Image
          src={normalizedData.image?.[0] || '/default-image.jpg'}
          alt={normalizedData.property_name || 'Hotel Image'}
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
              <CardTitle className="text-xl font-bold">{normalizedData.property_name || 'Property Name'}</CardTitle>
              <CardDescription className="text-sm text-gray-500">{normalizedData.property_type?.name || 'Property Type'}</CardDescription>
            </div>
            <div className="flex items-center bg-blue-100 px-2 py-1 rounded">
              <span className="text-lg font-bold text-blue-800 mr-1">{normalizedData.star_rating || 'N/A'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mb-4">
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">{normalizedData.description || 'Description not available'}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {trueProperties.slice(0, 5).map((property, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {property}
              </span>
            ))}
            {trueProperties.length > 5 && (
              <span className="text-blue-600 text-xs font-medium">+{trueProperties.length - 5} more</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <p>{normalizedData.property_address?.city || 'City'}, {normalizedData.property_address?.country || 'Country'}</p>
            <p>4-6 guests · Entire Home · 5 beds · 3 bath {bed} bed(s), {bathroom} bathroom(s)</p>
          </div>
        </CardContent>
        <CardFooter className="p-0 flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-600 text-sm">(318 reviews)</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default HotelCardDetails;
