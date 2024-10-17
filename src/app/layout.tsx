import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { Providers } from "./provider";
import Footer from "../components/layout/Footer";
import Script from "next/script"; // Import the Script component

const popins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Trip Swift",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload" // Load the script lazily, after the page is loaded
        />
      </head>
      <body className={popins.className}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}