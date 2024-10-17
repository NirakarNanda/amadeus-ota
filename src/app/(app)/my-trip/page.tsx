"use client";

import React from "react";
import Image from "next/image";
import Booked from "@/components/assets/booking.png";
import Cancel from "@/components/assets/calendar.png";
import Complete from "@/components/assets/checked.png";
// import { getReservationsOfUser } from "@/hooks/getReservations";
import { useSelector } from "@/Redux/store";
import { ShowReservations } from "@/components/reservation_components/ShowReservations";


export default function Tabs() {
  const [openTab, setOpenTab] = React.useState(1);
  // const authUser: any = useSelector((state) => state.authReducer.user);

  // const { reservation, error, loading } = getReservationsOfUser(authUser?._id as string);

  return (
    <>
      <div className="">
        <div
          className={`${
            openTab === 1
              ? "bg-blue-500"
              : openTab === 2
              ? "bg-red-500"
              : "bg-green-500"
          } h-[17vh]`}
        ></div>
        <div className="flex flex-wrap justify-center items-center mt-24 mb-unit-4xl">
          <div className="w-full max-w-[73%] border absolute top-[10%] bg-white px-7 mt-9  rounded">
            <ul
              className="flex mb-0 list-none flex-wrap pt-9  pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto border text-center cursor-pointer">
                <a
                  className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded flex justify-center items-center leading-normal ${
                    openTab === 1
                      ? "border-b-3 border-blue-500 "
                      : "text-gray-600 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                >
                  <Image className=" text-base mr-1" src={Booked} alt={""} />{" "}
                  <span>Booking</span>
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto border text-center cursor-pointer">
                <a
                  className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded flex justify-center items-center leading-normal ${
                    openTab === 2
                      ? "border-b-3 border-red-500"
                      : "text-gray-600 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                >
                  <Image className=" text-base mr-1" src={Cancel} alt={""} />{" "}
                  <span>Cancelled</span>
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto border text-center cursor-pointer">
                <a
                  className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded flex justify-center items-center leading-normal ${
                    openTab === 3
                      ? "border-b-3 border-green-500"
                      : "text-gray-600 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                >
                  <Image className=" text-base mr-1" src={Complete} alt={""} />
                  <span className="">Completed</span>
                </a>
              </li>
            </ul>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow border rounded">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div
                    className={openTab === 1 ? "block" : "hidden"}
                    id="link1"
                  >
                    <ShowReservations />
                  </div>
                  <div
                    className={openTab === 2 ? "block" : "hidden"}
                    id="link2"
                  >
                    <p className="text-2xl p-7 m-3">
                      You have no cancelled bookings.
                      <br />
                      <br />
                    </p>
                  </div>
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    <p className="text-2xl p-7 m-3">
                      You have no completed any bookings.
                      <br />
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
