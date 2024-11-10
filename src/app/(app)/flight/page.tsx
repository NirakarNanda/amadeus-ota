"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FlightCard from "@/components/FlightCard/FlightCard";
import Filters from "@/components/ui/flight-ui/filters";
import { useFlightOffersStore } from "@/components/context/flight-offers-provider";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";

export default function FlightsPage() {
  const { flightOffers, setFlightOffers } = useFlightOffersStore((state) => state);
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  // Redux hooks
  const dispatch = useDispatch();
  //const { directFlight, includedAirlines } = useSelector((state: RootState) => state.filter);

  useEffect(() => {
    const storedOffers = localStorage.getItem("flightOffers");
    if (storedOffers) {
      setFlightOffers(JSON.parse(storedOffers));
    }
    if (searchParams.toString() && (!storedOffers || !JSON.parse(storedOffers).data?.length)) {
      fetchFlights();
    }
  }, [searchParams, setFlightOffers]);

  const fetchFlights = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_AIRLINE}/flights/flight-offers`,
        { 
          params: {
            ...Object.fromEntries(searchParams.entries()),
          } 
        }
      );
      setFlightOffers(response.data);
      localStorage.setItem("flightOffers", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>New Search</span>
            </Link>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
            >
              {isFiltersOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {isFiltersOpen && (
            <div className="md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-lg p-6">
              <Filters />
            </div>
          )}
          
          <div className={`flex-1 ${!isFiltersOpen ? "w-full" : ""}`}>
            {flightOffers?.data?.data?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flights Found</h3>
                <p className="text-gray-600">Try adjusting your search parameters or select different dates.</p>
                <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start New Search
                </Link>
              </div>
            ) : flightOffers?.data ? (
              <div className="space-y-4">
                {flightOffers?.data?.data?.map((offer) => (
                  <div key={offer.id} className="transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    <FlightCard flight={offer} dictionaries={flightOffers.data.dictionaries} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-600">Enter your travel details to find available flights.</p>
                <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Search Flights
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}