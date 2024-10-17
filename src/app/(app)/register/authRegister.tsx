"use client";
import React, { useState } from "react";
import Image from "next/image";
import LoginImg from "@/components/assets/login.jpg";
import Link from "next/link";
import { login } from "@/api/auth";
import LoginIcon from "@/components/assets/TRIP-1.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import InputFields from "@/components/ui/input/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          email,
          firstName,
          lastName,
          password,
          role: "user",
        }
      );

      if (response.status === 201) {
        setLoading(false);
        toast.success("Registartion successful");
        router.push("/login");
        console.log(response.data);
      } else {
        toast.error("Something went wrong");

        setLoading(true);
        console.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="flex ">
      {/* Image Section */}
      {/* <div className="w-[67%] h-screen sm:hidden lg:block"> */}
      <div className="lg:w-1/2 hidden lg:flex justify-center items-center min-h-screen">
        <Image src={LoginImg} alt={"Login"} className="my-auto" />
      </div>

      {/* <div className="relative flex flex-col min-h-screen overflow-hidden"> */}
      <div className="justify-center flex items-center min-h-screen w-full px-4 lg:w-1/2  ">
        {/* <div className="w-full  bg-white border mt-28 p-12 gap-6 rounded-md shadow-md shadow-[#FF745C] lg:max-w-xl"> */}
        <div className="bg-white justify-center items-center border mx-auto my-8 p-12  gap-6 rounded-md shadow-md shadow-[#FF745C] max-w-lg w-full">
          {/* <h1 className="text-3xl font-bold text-center text-gray-700">Logo</h1> */}
          <div className="flex justify-center items-center ">
            <h1 className="text-2xl font-semibold">Register </h1>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className=" py-2 mb-2">
              <InputFields
                label="First Name"
                type="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className=" py-2 mb-2">
              <InputFields
                label="Last Name"
                type="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="py-2 mb-2">
              <InputFields
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="py-2 mb-4 relative">
              <InputFields
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex  top-4 items-center pr-2 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              className="w-full flex justify-center items-center px-4 py-2 tracking-wide text-white font-bold transition-colors duration-200 transform bg-[#FF745C] rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="sr-only">Loading...</span>
                  <Loader2 className="ml-4 w-6 h-6 animate-spin flex justify-center items-center" />
                </>
              ) : (
                <>Register</>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center w-full mt-6 border border-t">
            <div className="absolute px-5 bg-white">Or</div>
          </div>
          <p className="mt-4 text-sm text-center text-gray-700">
            Already have an account?
            <Link
              href="/login"
              className="font-medium text-[#FF745C] hover:underline"
            >
              {" "}
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
