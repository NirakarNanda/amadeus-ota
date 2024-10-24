  "use client";

  import React, { useState, useCallback } from "react";
  import { useDispatch, useSelector } from "@/Redux/store";
  import { useRouter } from "next/navigation";
  import Image from "next/image";
  import DateRange from "./DateRange";
  import GuestBox from "./GuestBox";
  import { getHotelsByCity } from '@/api/hotel';
  import { ChevronLeft, ChevronRight, Search, MapPin } from 'lucide-react';

  import ParisImage from "../assets/popular/paris.jpg";
  import DubaiImage from "../assets/popular/dubai.jpg";
  import LondonImage from "../assets/popular/london.jpg";
  import SingaporeImage from "../assets/popular/singapore.jpg";

  const HotelCard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dates, setDates] = useState<string[] | undefined>(undefined);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const dispatch = useDispatch();
    const router = useRouter();
    const dateRangeDetails = useSelector((state) => state.hotel.dateRangeDetails);

    const carouselImages = [
      { url: ParisImage, alt: "Paris", city: "Paris, France" },
      { url: DubaiImage, alt: "Dubai", city: "Dubai, UAE" },
      { url: LondonImage, alt: "London", city: "London, UK" },
      { url: SingaporeImage, alt: "Singapore", city: "Singapore" }
    ];

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    React.useEffect(() => {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }, []);

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

    const handleSearch = (event: any) => {
      event.preventDefault();
      if (searchQuery) fetchSearchedProperties(searchQuery);

      const checkinDate = encodeURIComponent(dateRangeDetails?.dates?.[0] || '');
      const checkoutDate = encodeURIComponent(dateRangeDetails?.dates?.[1] || '');
      const dateRangeQueryString = `checkin=${checkinDate}&checkout=${checkoutDate}`;

      router.push(`/destination?location=${searchQuery}&${dateRangeQueryString}`);
    };

    return (
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100">
  <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100">
    <div className="relative w-full h-full overflow-hidden rounded-b-[20px] sm:rounded-b-[40px]">
    {carouselImages.map((image, index) => (
      <div
        key={index}
        className="absolute w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(${(index - currentSlide) * 100}%)`,
        }}
      >
        <Image
          src={image.url}
          alt={image.alt}
          className="object-cover w-full h-full"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-[30%] sm:bottom-36 left-1/2 -translate-x-1/2 text-center w-full px-4">
          <h2 className="text-white text-2xl sm:text-4xl font-bold mb-2">{image.city}</h2>
          <p className="text-white/80 text-base sm:text-lg">Discover amazing stays</p>
        </div>
      </div>
    ))}

    {/* Navigation Arrows */}
    <button
      onClick={prevSlide}
      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
    >
      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
    >
      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    </button>

    {/* Search Section */}
    <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where are you going?"
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base transition duration-200 ease-in-out hover:border-blue-300"
            />
          </div>
          </div>

          <div className="w-full lg:w-auto">
            <DateRange
              dates={dates}
              setDates={setDates}
            />
          </div>

          <div className="w-full lg:w-auto">
            <GuestBox />
          </div>

          <button
            onClick={handleSearch}
            className="w-full lg:w-auto bg-[#D80032] hover:bg-[#FF1E1E] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-[90%] sm:max-w-md">
            {error}
          </div>
        )}
        {loading && (
          <div className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg max-w-[90%] sm:max-w-md">
            Searching...
          </div>
        )}
      </div>
    );
  };

  export default HotelCard;