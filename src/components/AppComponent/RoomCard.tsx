import React from "react";
import Image from "next/image";
import { FaStar, FaWifi, FaSnowflake, FaKitchenSet, FaFireFlameCurved } from "react-icons/fa6";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import roomImage1 from "../assets/amadeus-room/r1.jpg";
import roomImage2 from "../assets/amadeus-room/r2.jpg";
import roomImage3 from "../assets/amadeus-room/r3.jpg";
import roomImage4 from "../assets/amadeus-room/r4.jpg";

interface RoomOffer {
  id: string;
  room: {
    type: string;
    typeEstimated: {
      category: string;
      bedType: string;
    };
    description: {
      text: string;
    };
  };
  price: {
    currency: string;
    total: string;
  };
  policies: {
    paymentType: string;
  };
}

interface RoomCardProps {
  offer: RoomOffer;
  hotelId: string;
  onBookNow: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ offer, hotelId, onBookNow }) => {
  const images = [roomImage1, roomImage2, roomImage3, roomImage4];

  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  const selectedImage = images[0];

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
          src={selectedImage}
          alt="Room image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl text-blue-600">
          {offer?.room?.typeEstimated?.category} - {offer?.room?.typeEstimated?.bedType}
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
          {offer?.price?.currency} {offer?.price?.total}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Policies: {offer?.policies?.paymentType}</p>
        <button
          onClick={onBookNow}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
        >
          Book Now
        </button>
      </CardFooter>
    </Card>
  );
};