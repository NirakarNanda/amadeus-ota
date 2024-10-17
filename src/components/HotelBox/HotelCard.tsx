"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "@/Redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeroImage from "@/components/assets/hotel-1.jpg";
import DateRange from "./DateRange";
import 'regenerator-runtime/runtime';
//import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import { SpeechToText } from '../NLP/searchSpeechToText';
import axios from "axios";
import HotelCardDetails from "../hotelListingComponents/HotelCardDetails";
import GuestBox from "./GuestBox";
import { getHotelsByCity } from '@/api/hotel';

// Define interfaces
interface JsonStoredData {
  StartingDate: Date | null;
  EndingDate: Date | null;
  Persons: string | null;
  Location: string | null;
  ChildCount: number | null;
  AdultCount: number | null;
  Transcript: string | null;
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

interface RoomAmenity {
  amenities?: {
    basic?: {
      bed: string;
      bathroom: boolean;
    };
  };
}


const HotelCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState('');
  const [dates, setDates] = useState<string[] | undefined>(undefined);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSpeechInput, setHasSpeechInput] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const dateRangeDetails = useSelector((state) => state.hotel.dateRangeDetails);

  const key: string = process.env.NEXT_PUBLIC_OPENAI_KEY || '';
  //const { listening, transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  // const [jsonStoredData, setJsonStoredData] = useState<JsonStoredData>({
  //   StartingDate: null,
  //   EndingDate: null,
  //   Persons: null,
  //   Location: null,
  //   ChildCount: null,
  //   AdultCount: null,
  //   Transcript: null,
  // });

  const fetchSearchedProperties = useCallback(async (location: string) => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const hotelData = await getHotelsByCity(location);
      setHotels(hotelData.data || []);
    } catch (error) {
      setError("Failed to fetch properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   if (hasSpeechInput && jsonStoredData.Location) {
  //     setSearchQuery(jsonStoredData.Location);
  //     fetchSearchedProperties(jsonStoredData.Location);

  //     if (!listening) {
  //       const checkinDate = dateRangeDetails?.dates?.[0] ? encodeURIComponent(dateRangeDetails.dates[0]) : '';
  //       const checkoutDate = dateRangeDetails?.dates?.[1] ? encodeURIComponent(dateRangeDetails.dates[1]) : '';
        
  //       const dateRangeQueryString = `checkin=${checkinDate}&checkout=${checkoutDate}`;
  //       router.push(`/destination?location=${jsonStoredData.Location}&${dateRangeQueryString}`);
  //     }
  //   }
  // }, [jsonStoredData, hasSpeechInput, fetchSearchedProperties, listening, router, dateRangeDetails?.dates]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery) fetchSearchedProperties(searchQuery);

    const checkinDate = encodeURIComponent(dateRangeDetails?.dates?.[0] || '');
    const checkoutDate = encodeURIComponent(dateRangeDetails?.dates?.[1] || '');
    const dateRangeQueryString = `checkin=${checkinDate}&checkout=${checkoutDate}`;

    router.push(`/destination?location=${searchQuery}&${dateRangeQueryString}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {/* Hero image section */}
      <div className="relative">
        <div className="block">
          <Image
            src={HeroImage}
            className="w-full object-cover h-[360px] opacity-90"
            alt="Hero Image"
          />
        </div>

        <div className="lg:mt-[100px] sm:mt-20 flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <section className="border-2 bg-white rounded-xl p-4 lg:p-8 w-full max-w-full mx-auto lg:absolute lg:bottom-0 lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="rounded-md border-2">
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={searchQuery}
                  className="border rounded-md focus:outline-none p-2 w-80 max-w-md"
                  placeholder="Search by city, hotel, or location"
                  onChange={handleInputChange}
                />
              </div>

              <div className="inline-block max-w-xs w-80 border-2 border-gray-300 rounded-lg ">
                  <DateRange dates={dates} setDates={setDates} />
                </div>

                <div className="inline-block p-2 max-w-md w-[200px] border-2 border-gray-300 rounded-lg">
                  <GuestBox />
                </div>


              <button
                onClick={handleSearch}
                className="bg-[#D80032] hover:bg-red-500 text-xl font-bold text-white p-3 w-28 sm:w-32 rounded-md transition duration-200"
              >
                Search
              </button>

              {/* <SpeechToText
                apiKey={key}
                SpeechRecognition={SpeechRecognition}
                resetTranscript={resetTranscript}
                browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
                transcript={transcript}
                setJsonStoredData={(data: JsonStoredData) => {
                  if (data.Location) {
                    setJsonStoredData(data);
                    setHasSpeechInput(true);
                    setSearchQuery(data.Location);
                  }
                }}
                mic_color="#ee121d50"
                mic_bg_color='#ee121d50'
                listening={listening}
                setText={setText}
                text={text}
              /> */}
            </div>
          </section>
        </div>
      </div>

      {/* Error and loading states */}
      {error && <div className="text-red-500 font-semibold mt-4">Error: {error}</div>}
      {loading && <div className="text-blue-500 font-semibold mt-4">Loading...</div>}

      {/* Hotel results section */}
      {hotels.length > 0 && (
        <section className="mt-8">
          <h1 className="text-2xl font-semibold mb-6">Search Results</h1>
          <div className="grid grid-cols-1 gap-4">
            {hotels.map((hotel) => (
              <HotelCardDetails hotelData={hotel} key={""} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default HotelCard;