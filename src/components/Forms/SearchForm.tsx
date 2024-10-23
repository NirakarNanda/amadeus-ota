"use client";

import React, { useEffect, useState } from "react";
import { PlaneTakeoff, PlaneLanding, ArrowLeftRight, Users, Search } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "react-select";
import Traveler, { Child } from "@/components/ui/flight-ui/travelerUi";
import { DateRangePicker, DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import format from "date-fns/format";
import axios, { isAxiosError } from "axios";
import { FlightOffersResponseRoot } from "@/store";
import { useFlightOffersStore } from "../context/flight-offers-provider";
import { useDebounce } from "@/hooks/useDebounce";
import { addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/flight-ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/flight-ui/popover";
import Checkbox from "@/components/Search/Checkbox";

const SearchForm = () => {
  const [flightState, setFlightState] = useState({
    isFromOpen: false,
    isToOpen: false,
  });

  const [isRotated, setIsRotated] = useState(false);
  
  const { setFlightOffers, setLoading, setSearched, searched, searchForm, updateSearchFormField } = useFlightOffersStore((state) => state);

  const [searchTerm, setSearchTerm] = useState("");
  const [departureLocations, setDepartureLocations] = useState([]);
  const [destinationLocations, setDestinationLocations] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState<Child[]>([]);
  const [openTraveler, setOpenTraveler] = useState<boolean>(false);

  const handleDepartureSearchChange = (value: string) => {
    if (!value) return;
    axios
      .get(`http://localhost:3000/locations?keyword=${value}`)
      .then((response) => {
        const locations = response.data?.data?.data
          .filter((el: any) => el.subType === "CITY")
          .map((el: any) => ({
            label: el.address.cityName + ` (${el.iataCode})`,
            value: el.iataCode,
          }));
        setDepartureLocations(locations);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  };

  const handleDestinationSearchChange = (value: string) => {
    if (!value) return;
    axios
      .get(`http://localhost:3000/locations?keyword=${value}`)
      .then((response) => {
        const locations = response.data?.data?.data
          .filter((el: any) => el.subType === "CITY")
          .map((el: any) => ({
            label: el.address.cityName + ` (${el.iataCode})`,
            value: el.iataCode,
          }));
        setDestinationLocations(locations);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  };

  useEffect(() => {
    handleDepartureSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleDestinationSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = (await axios.get("http://localhost:3000/flight-offers", {
        params: {
          originLocationCode: searchForm.origin.value,
          destinationLocationCode: searchForm.destination.value,
          departureDate: searchForm.departureDate,
          adults: searchForm.adult,
          children: searchForm.child,
          returnDate: searchForm.returnDate,
          travelClass: searchForm.travelClass,
          nonStop: searchForm.directFlight 
        },
      })) as { data: FlightOffersResponseRoot };
      setFlightOffers(response.data);

      if (!searched) setSearched(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (isAxiosError(error)) {
        console.error("Error message:", error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tempOrigin = { ...searchForm.origin }; 
    const tempDestination = { ...searchForm.destination };
    
    updateSearchFormField("origin", tempDestination);
    updateSearchFormField("destination", tempOrigin);
  }, [isRotated]);

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      minHeight: '2.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#94a3b8',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e2e8f0' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      cursor: 'pointer',
    }),
  };

  return (
    
    <Card className="w-full max-w-6xl mx-auto">
      <Checkbox/>
      <CardContent className="p-6">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Departure Select */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <PlaneTakeoff size={16} />
                <span>From</span>
              </div>
              <Select
                className="w-full"
                onInputChange={(value, { action }) => {
                  if (action === "input-change") {
                    setSearchTerm(value);
                  }
                }}
                onChange={(value) => updateSearchFormField("origin", value!)}
                options={departureLocations}
                placeholder="Enter city or airport"
                styles={customSelectStyles}
              />
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-50"
                onClick={() => setIsRotated(!isRotated)}
              >
                <ArrowLeftRight
                  className={`transform transition-transform duration-300 ${
                    isRotated ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </Button>
            </div>

            {/* Destination Select */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <PlaneLanding size={16} />
                <span>To</span>
              </div>
              <Select
                className="w-full"
                onInputChange={(value, { action }) => {
                  if (action === "input-change") {
                    setSearchTerm(value);
                  }
                }}
                onChange={(value) => updateSearchFormField("destination", value!)}
                options={destinationLocations}
                placeholder="Enter city or airport"
                styles={customSelectStyles}
              />
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <span>Date</span>
              </div>
              {searchForm.tripType === "ROUNDTRIP" ? (
                <DateRangePicker
                  className="w-full"
                  editable={false}
                  placeholder={format(Date.now(), "EEE, d MMM")}
                  renderValue={([start, end]) =>
                    format(start, "EEE, d MMM") + " - " + format(end, "EEE, d MMM")
                  }
                  onChange={(value) => {
                    updateSearchFormField(
                      "departureDate",
                      value ? addDays(value[0], 1).toISOString().split("T")[0] : ""
                    );
                    updateSearchFormField(
                      "returnDate",
                      value ? addDays(value[1], 1).toISOString().split("T")[0] : ""
                    );
                  }}
                />  
              ) : (
                <DatePicker
                  placeholder={format(new Date(), "EEE, d MMM")}
                  value={new Date(searchForm.departureDate)}
                  onChange={(value) =>
                    updateSearchFormField(
                      "departureDate",
                      value ? value.toISOString().split("T")[0] : ""
                    )
                  }
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {/* Travelers Selector */}
            <Popover open={openTraveler} onOpenChange={setOpenTraveler}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Users size={18} />
                  <span>
                    {adults} Adult{adults > 1 && "s"}, {children.length} Child
                    {children.length !== 1 && "ren"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Traveler
                  adults={adults}
                  setAdults={setAdults}
                  child={children}
                  setChildren={setChildren}
                  onDone={() => setOpenTraveler(false)}
                />
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button
              onClick={onSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Flights
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;