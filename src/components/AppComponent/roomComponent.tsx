"use client";
import 'regenerator-runtime/runtime';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaStar, FaWifi, FaSnowflake, FaKitchenSet, FaFireFlameCurved, FaSmoking } from "react-icons/fa6";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import toast from 'react-hot-toast';

import Header from "@/components/hotelListingComponents/roomAmenities";
import { RoomSpeechToText } from "@/components/NLP/roomSpeechToText";
import { roomsByProperty } from "@/api/hotel";

// Define interfaces for type safety
interface Room {
  _id: string;
  room_name?: string;
  room_type?: string;
  total_room?: number;
  floor?: number;
  room_view?: string;
  room_size?: number;
  room_unit?: String;
  smoking_policy?: string;
  max_occupancy?: number;
  max_number_of_adults?: number;
  max_number_of_children?: number;
  number_of_bedrooms?: number;
  number_of_living_room?: number;
  extra_bed?: number;
  description?: string;
  image?: string[];
  meal_plan: string;
  rateplan_id: string;
  room_price: number; 
}

interface RoomAmenity {
  _id: string;
  amenities: string[];
}

interface RoomsApiResponse {
  data: Room[];
}

// Main component
const RoomsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");

  // State management
  const [rooms, setRooms] = useState<RoomsApiResponse | null>(null);
  const [roomAmenitiesData, setRoomAmenitiesData] = useState<{ [key: string]: RoomAmenity }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string>("");
  const [jsonStoredData, setJsonStoredData] = useState<any>(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [text, setText] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY || '';

  // Fetch rooms data
  useEffect(() => {
    const fetchRoomsData = async () => {
      if (!propertyId) return;

      setIsLoading(true);
      try {
        const response = await roomsByProperty(propertyId);
        if (typeof response === "object" && response !== null) {
          const roomsData = response as RoomsApiResponse;
          setRooms(roomsData);
          console.log("Rooms data fetched:", roomsData);

          // Fetch amenities for each room (commented out for now)
          // const amenitiesPromises = roomsData.data.map(room => 
          //   roomAmenities(room._id).catch(error => {
          //     console.error(`Error fetching amenities for room ${room._id}:`, error);
          //     return null;
          //   })
          // );

          // const amenitiesResults = await Promise.all(amenitiesPromises);
          // const newRoomAmenitiesData = amenitiesResults.reduce((acc, amenities, index) => {
          //   if (amenities && isRoomAmenity(amenities)) {
          //     acc[roomsData.data[index]._id] = amenities;
          //   }
          //   return acc;
          // }, {} as { [key: string]: RoomAmenity });

          // setRoomAmenitiesData(newRoomAmenitiesData);
        } else {
          console.error("Unexpected response format:", response);
          toast.error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Unable to load rooms. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomsData();
  }, [propertyId]);

  // Set date range
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    setDateRange(`${today.toLocaleDateString()} - ${nextWeek.toLocaleDateString()}`);
  }, []);

  // Handle speech recognition results
  const handleSpeechResults = useCallback(() => {
    if (!jsonStoredData || !jsonStoredData.RoomName || !rooms) return;

    console.log("JSON Stored Data:", jsonStoredData);
    console.log("Looking for room:", jsonStoredData.RoomName);

    const matchingRoom = rooms.data.find(room => 
      room.room_name?.toLowerCase().includes(jsonStoredData.RoomName.toLowerCase())
    );

    if (matchingRoom) {
      console.log("Matching room found:", matchingRoom);
      toast.success(`Room "${matchingRoom.room_name}" found! Redirecting to booking page.`, {
        duration: 3000,
        icon: '🎉',
      });
      setTimeout(() => {
        router.push(`/booking?id=${propertyId}&roomId=${matchingRoom._id}`);
      }, 3000);
    } else {
      console.log("No matching room found");
      toast.error(`Sorry, I couldn't find a room named "${jsonStoredData.RoomName}". Please try again with a different room name.`, {
        duration: 5000,
        icon: '🔍',
      });
    }
  }, [jsonStoredData, rooms, propertyId, router]);

  useEffect(() => {
    handleSpeechResults();
  }, [handleSpeechResults]);

  return (
    <>
      <Header tag={"Rooms Details"} />

      <div className="container mx-auto mt-6 px-4">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6 p-4 ">
          <h1 className="text-2xl font-semibold text-gray-800">Rooms in Property</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300 shadow-md">
              <span>{rooms?.data?.length || 0}</span>
              <span className="ml-2">results</span>
            </div>
            <div className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors duration-300 shadow-md">
              <span>{dateRange}</span>
            </div>
          </div>
        </div>

        {/* Speech-to-text component */}
        <div className="mb-8">
          <RoomSpeechToText
            apiKey={apiKey}
            SpeechRecognition={SpeechRecognition}
            resetTranscript={resetTranscript}
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
            transcript={transcript}
            setJsonStoredData={setJsonStoredData}
            mic_color="black"
            mic_bg_color="white"
            listening={listening}
            setText={setText}
            text={text}
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-300 h-96 rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}

        {/* No rooms available state */}
        {!isLoading && rooms?.data?.length === 0 && <p className="text-center text-xl">No rooms available.</p>}

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.data?.map((room: Room) => (
            <RoomCard key={room._id} propertyId={propertyId} room={room} amenities={roomAmenitiesData[room._id]?.amenities || []} />
          ))}
        </div>
      </div>
    </>
  );
};

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "wifi": return <FaWifi />;
    case "air conditioning": return <FaSnowflake />;
    case "kitchen": return <FaKitchenSet />;
    case "heating": return <FaFireFlameCurved />;
    case "smoking": return <FaSmoking />;
    default: return null;
  }
};

// RoomCard component
const RoomCard: React.FC<{ room: Room; amenities: string[], propertyId: string | null }> = ({ room, amenities, propertyId }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <div className="relative w-full h-48">
      {room.image && room.image.length > 0 && (
        <Image
          priority
          src={room.image[0]}
          alt={"Room image"}
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
      )}
    </div>
    <CardHeader>
      <CardTitle className="text-2xl text-blue-600">{room.room_name}</CardTitle>
      <CardDescription className="text-gray-600">{room.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-3 mb-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-1 text-sm text-red-600 group-hover:text-green-600 transition-colors duration-300">
            {getAmenityIcon(amenity)}
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-blue-600">Rs. {room.room_price}</span>
          <span className="text-zinc-800 ml-1">/night</span>
        </div>
        <span className="text-gray-500 text-sm">Capacity: {room.max_occupancy} persons </span>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center bg-gray-50">
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium text-green-600">4.0</span>
        <FaStar />
        <span className="text-sm text-gray-600">(7 Reviews)</span>
      </div>
      <Link
        href={`/booking?id=${propertyId}&roomId=${room._id}`}
        className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Book Now
      </Link>
    </CardFooter>
  </Card>
);

// Type guard function to check if the response is of type RoomAmenity
function isRoomAmenity(response: unknown): response is RoomAmenity {
  return (
    typeof response === "object" &&
    response !== null &&
    "_id" in response &&
    "amenities" in response &&
    Array.isArray((response as RoomAmenity).amenities)
  );
}

export default RoomsPage;