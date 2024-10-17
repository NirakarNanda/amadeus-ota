import 'regenerator-runtime/runtime';

import HotelCard from "@/components/HotelBox/HotelCard";
import PayNowFunction from "@/components/paymentComponents/PayNowFunction";
import HotelPicture from "@/components/homeComponents/HomeSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <BookingBox/> */}
      <HotelCard />
      <HotelPicture />
      {/* <PayNowFunction /> */}
    </div>
  );
}
