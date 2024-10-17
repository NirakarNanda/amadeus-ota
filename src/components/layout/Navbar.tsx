// Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { logout, getUser } from "@/Redux/slices/auth.slice";
import toast from "react-hot-toast";

import Home from "@/components/assets/modern-house.png";
import Globe from "@/components/assets/globe.png";
import MTrip from "@/components/assets/traveling.png";
import Logo from "../assets/TRIP-1.png";

// Define RootState type based on your store's state shape
interface RootState {
  authReducer: {
    user: UserType | null;
  };
}

// Define UserType
interface UserType {
  firstName: string;
  lastName: string;
  email: string;
}

// Define AppDispatch type
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.authReducer.user);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      dispatch(getUser() as any); // Cast to `any` if needed, make sure `getUser` is properly typed
    }
  }, [dispatch, accessToken]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    toast.success("Successfully logged out");
    dispatch(logout() as any); // Cast to `any` if needed, make sure `logout` is properly typed
  };

  const handleSignup = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };


  return (

    <div
      className={`bg-white shadow sticky top-0 z-20 ${pathname === "/login" || pathname === "/register" ? "hidden" : ""
        }`}
    >
      <div className="flex z-50 items-center justify-between px-6 py-4">
        <Link href="/">
          <Image src={Logo} width={70} height={35} alt="Logo" />
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden cursor-pointer z-10" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} className="text-black" /> : <Menu size={24} />}
        </div>
        <div
          className={`lg:flex items-center ${isMenuOpen ? "block" : "hidden"
            } lg:block`}
        >
          <ul className="lg:flex items-center gap-4 mt-4 lg:mt-0">
            <li className="flex items-center gap-2 p-2 border rounded-lg hover:border-gray-500 transition">
              <Image src={Globe} width={24} height={24} alt="Become a Host" />
              <Link href={`${process.env.NEXT_PUBLIC_PMS_URL}`} className="text-black text-sm font-medium">
                Become a Host
              </Link>
            </li>
            <li className="flex items-center gap-2 p-2 border rounded-lg hover:border-gray-500 transition">
              <Link href="/my-trip">
                <Image src={MTrip} width={24} height={24} alt="My Trip" />
              </Link>
              <Link href="/my-trip" className="text-black text-sm font-medium">
                My Trip
              </Link>
            </li>
            {user ? (
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{ isBordered: true, src: "" }}
                    className="transition-transform"
                    description={`${user.email}`}
                    name={`${user.firstName} ${user.lastName}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile-settings">
                    Profile Settings
                  </DropdownItem>
                  <DropdownItem key="help-feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="lg:block transition-transform sm:hidden"
                    src=""
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="sign-up" onClick={handleSignup}>
                    Sign Up
                  </DropdownItem>
                  <DropdownItem key="login" onClick={handleLogin}>
                    Log In
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-100 h-full mt-[-8px] w-full absolute top-2 z-10">
          <ul className="flex flex-col gap-3 items-center">
            <div
              onClick={closeMenu}
              className="absolute top-4 right-4 sm:top-1 sm:right-4 md:top-1 md:right-4 lg:top-4 lg:right-4 xl:top-4 xl:right-4 cursor-pointer"
            >
              <X size={24} />
            </div>

            <ul className="flex mt-5 mr-[40px] space-x-4">
              <li className="flex items-center p-3 border-2 rounded-lg hover:border-gray-500 transition">
                <Link
                  href="/become-host">
                <Image src={Globe} width={24} height={24} alt="Become a Host" />
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_PMS_URL}`}
                  className="text-black ml-2 text-sm font-medium"
                >
                  Become a Host
                </Link>
              </li>

              <li className="flex items-center p-3 border-2 rounded-lg hover:border-gray-500 transition">
                <Link
                  href="/my-trip">
                <Image src={MTrip} width={24} height={24} alt="My Trip" />
                </Link>
                <Link
                  href="/my-trip"
                  className="text-black text-sm font-medium"
                >
                  My Trip
                </Link>
              </li>
            </ul>
            {user ? (
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{ isBordered: true, src: "" }}
                    className="transition-transform"
                    description={`${user.email}`}
                    name={`${user.firstName} ${user.lastName}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile-settings">
                    Profile Settings
                  </DropdownItem>
                  <DropdownItem key="help-feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    src=""
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="sign-up" onClick={handleSignup}>
                    Sign Up
                  </DropdownItem>
                  <DropdownItem key="login" onClick={handleLogin}>
                    Log In
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
