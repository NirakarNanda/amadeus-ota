"use client";

import React, { useState } from "react";
import { login } from "@/Redux/slices/auth.slice";
import InputFields from "@/components/ui/input/input";
import { RootState } from "@/Redux/store";
import Image from "next/image";
import LoginImg from "../../../components/assets/login.jpg";
import Link from "next/link";
import LoginIcon from "@/components/assets/TRIP-1.png";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "@/Redux/store";
import Cookies from "js-cookie";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { message } from "antd";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      await dispatch(login({ email, password }));
      toast.success("Login successful");

      setLoading(false);
      router.push("/");
    } catch (error: any) {
      toast.error("Please verify your email and password");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex ">
      {/* Image Section */}
      {/* <div className="w-[67%] h-screen  sm:hidden lg:block"> */}
      <div className="lg:w-1/2 hidden lg:flex justify-center items-center min-h-screen">
        <Image src={LoginImg} alt={"Login"} className="" />
      </div>

      {/* Sign-up Section */}
      {/* <div className="relative flex flex-col min-h-screen overflow-hidden  "> */}
      <div className="justify-center flex items-center min-h-screen w-full px-4 lg:w-1/2  ">
        {/* <div className="w-full  bg-white border mt-36 p-12 gap-6   rounded-md shadow-md shadow-[#FF745C] lg:max-w-xl"> */}
        <div className="bg-white justify-center items-center border mx-auto my-8 p-12  gap-6 rounded-md shadow-md shadow-[#FF745C] max-w-lg w-full">
          <div className="flex justify-center items-center  p-4">
            <Image
              src={LoginIcon}
              width={80}
              height={39}
              alt={"logo"}
              className=" "
            />
          </div>

          <form className="mt-6 gap-5 " onSubmit={handleSubmit}>
            <div className="py-2">
              <InputFields
                label="Email"
                type="email"
                value={email}
                className=""
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
                <>Login</>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center w-full mt-9 border border-t">
            <div className="absolute px-5 bg-white">Or</div>
          </div>
          <p className="mt-4 text-sm text-center text-gray-700">
            Don &#39; t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#FF745C] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
