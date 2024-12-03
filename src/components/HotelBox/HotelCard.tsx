"use client";

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "@/Redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DateRange from "./DateRange";
import GuestBox from "./GuestBox";
import { getHotelsByCity } from '@/api/hotel';
import { Search, MapPin, Hotel, Plane, Loader2 } from 'lucide-react';
import SearchForm from "../Forms/SearchForm";
import Home from "@/components/assets/popular/Home.jpg";

const HotelCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dates, setDates] = useState<string[] | undefined>(undefined);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hotel');

  const dispatch = useDispatch();
  const router = useRouter();
  const dateRangeDetails = useSelector((state) => state.hotel.dateRangeDetails);

  const fetchSearchedProperties = useCallback(async (location: string) => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const hotelData = await getHotelsByCity(location);
      setHotels(hotelData.data || []);
    } catch (error) {
      setError("0 hotels available");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery) fetchSearchedProperties(searchQuery);

    const checkinDate = encodeURIComponent(dateRangeDetails?.dates?.[0] || '');
    const checkoutDate = encodeURIComponent(dateRangeDetails?.dates?.[1] || '');
    const dateRangeQueryString = `checkin=${checkinDate}&checkout=${checkoutDate}`;

    router.push(`/destination?location=${searchQuery}&${dateRangeQueryString}`);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[1000px] md:h-[500px] bg-gray-100">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 overflow-hidden">
          {/* Static Paris Image */}
          <div className="relative w-full h-full">
            <Image
              src={Home}
              alt="Hotel"
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-[30%] sm:bottom-36 left-1/2 -translate-x-1/2 text-center w-full px-4">
              <p className="text-white/80 text-base sm:text-lg">Discover amazing stays</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-6xl px-4">
              {/* Tab Buttons */}
              <div className="flex gap-2 mb-4 justify-center">
                <button
                  onClick={() => setActiveTab('hotel')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-t-lg transition-colors ${
                    activeTab === 'hotel'
                      ? 'bg-white text-[#D80032]'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Hotel className="w-5 h-5" />
                  <span>Hotels</span>
                </button>
                <button
                  onClick={() => setActiveTab('flight')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-t-lg transition-colors ${
                    activeTab === 'flight'
                      ? 'bg-white text-[#006ce4]'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Plane className="w-5 h-5" />
                  <span>Flights</span>
                </button>
              </div>

              {/* Search Forms */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
                {activeTab === 'hotel' ? (
                  <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Where are you going?"
                          className="w-full h-[33px] pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base transition duration-200 ease-in-out hover:border-blue-300"
                        />
                      </div>
                    </div>

                    <div >
                      <div className="border-2 border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                        <DateRange dates={dates} setDates={setDates} />
                      </div>
                    </div>

                    <div className="w-full lg:w-auto">
                      <GuestBox />
                    </div>

                    <div className="">
                      <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full h-[33px] bg-[#D80032] hover:bg-[#FF1E1E] disabled:bg-gray-400 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-medium text-lg shadow-lg shadow-red-500/30 disabled:shadow-none"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <SearchForm />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;