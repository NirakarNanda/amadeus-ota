"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/flight-ui/button";
import { Badge } from "@/components/ui/flight-ui/badge";
import { Separator } from "@/components/ui/flight-ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/flight-ui/popover";
import { Input } from "@/components/ui/flight-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/flight-ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, BaggageClaim, Briefcase, Plane } from "lucide-react";
import { BsSuitcase2 } from "react-icons/bs";

export default function FlightCard({
  flight,
  dictionaries,
}: {
  flight: any;
  dictionaries: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [origin, setOrigin] = useState(searchParams.get('originLocationCode') || '');
  const [destination, setDestination] = useState(searchParams.get('destinationLocationCode') || '');
  const [adults, setAdults] = useState(searchParams.get('adults') || '1');

  const isReturnType = flight?.itineraries?.length > 1;

  const getAirlines = (oneWay: boolean) => {
    return flight.itineraries[oneWay ? 0 : 1].segments.map(
      (segment: any) => dictionaries.carriers[segment.carrierCode]
    ).join(", ");
  };

  const getBaggage = () => {
    const baggages = flight?.travelerPricings
      ?.at(0)
      ?.fareDetailsBySegment?.at(0)
      ?.amenities?.filter((amenity: any) => amenity.amenityType === "BAGGAGE")
      ?.map((amenity: any) => amenity.description);
    return baggages?.join(", ");
  };

  const handleSearch = () => {
    if (!origin || !destination || !date) {
      alert("Please fill in all required fields");
      return;
    }

    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: format(date, 'yyyy-MM-dd'),
      adults: adults,
    });

    router.push(`/search?${params.toString()}`);
  };

  function setOpenViewDetailModal(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Plane className="h-6 w-6" />
          Flight Search
        </CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/** Input Fields **/}
          {[
            { label: 'From', value: origin, setter: setOrigin, placeholder: 'Origin (e.g., LAX)' },
            { label: 'To', value: destination, setter: setDestination, placeholder: 'Destination (e.g., JFK)' },
          ].map(({ label, value, setter, placeholder }, index) => (
            <div className="space-y-2" key={index}>
              <label className="text-sm font-medium">{label}</label>
              <Input 
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value.toUpperCase())}
                maxLength={3}
                className="uppercase"
              />
            </div>
          ))}

          {/** Date Selector **/}
          <div className="space-y-2">
            <label className="text-sm font-medium">Departure Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* Calendar component goes here */}
              </PopoverContent>
            </Popover>
          </div>

          {/** Passengers Selector **/}
          <div className="space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger>
                <SelectValue placeholder="Select passengers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          className="w-full md:w-auto md:ml-auto"
          onClick={handleSearch}
        >
          Search Flights
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-6">
        {getAirlines(true).split(", ").map((airline: string) => (
          <Badge
            key={airline}
            variant="secondary"
            className="bg-blue-100 text-blue-800 mr-2"
          >
            {airline}
          </Badge>
        ))}

        {/** Flight Details **/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-xl font-semibold">
              {format(new Date(flight?.itineraries[0]?.segments[0]?.departure?.at), "HH:mm")}
            </div>
            <div className="text-sm text-muted-foreground">
              {flight?.itineraries[0]?.segments[0]?.departure?.iataCode}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm font-medium">
              {flight?.itineraries[0]?.duration?.replace(/PT(\d+)H(\d+)M/, "$1h $2m")}
            </div>
            <Separator className="my-2" />
            <div className="text-sm text-muted-foreground">Direct</div>
          </div>

          <div className="text-center">
            <div className="text-xl font-semibold">
              {format(new Date(flight?.itineraries[0]?.segments[0]?.arrival?.at), "HH:mm")}
            </div>
            <div className="text-sm text-muted-foreground">
              {flight?.itineraries[0]?.segments[0]?.arrival?.iataCode}
            </div>
          </div>
        </div>

        {/** Baggage Information **/}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase />
            <BsSuitcase2 />
            <BaggageClaim />
            <span>Included: {getBaggage()}</span>
          </div>
          <div className="font-medium">
            {flight.price.currency} {flight.price.total}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-gray-50 rounded-b-lg">
        <div className="text-2xl font-bold">
          {flight.price.currency} {flight.price.total}
        </div>
        <Button 
          variant="default"
          onClick={() => setOpenViewDetailModal(true)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
