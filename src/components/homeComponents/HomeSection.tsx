"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 sm:mx-8 lg:mx-16 mt-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-[240px] bg-gray-300 rounded-lg"></div>
      </div>
    ))}
  </div>
);

export default function HomeSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<
    {
      img: string;
      title: string;
      price: string;
      destination_type: string;
    }[]
  >([]);

  useEffect(() => {
    function shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    const galleryLength = 6;
    const destinationType = [
      "Adventure Destination",
      "Beach Resort",
      "Cultural City",
      "Hotel",
      "Mountain Retreat",
      "Urban Metropolis",
    ];

    shuffleArray(destinationType);

    const loadImages = async () => {
      const newImages = [];
      for (let i = 1; i <= galleryLength; i++) {
        const currentDestination = destinationType[i - 1];
        const imageModule = await import(`../assets/hotel-${i}.jpg`);
        newImages.push({
          img: imageModule.default,
          title: `${currentDestination} ${i}`,
          price: `$${Math.floor(Math.random() * 500) + 100}.00`,
          destination_type: currentDestination,
        });
      }
      setImages(newImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-2">
          SIMPLY AMAZING PLACES
        </h2>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          Popular destinations in{" "}
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-500 text-transparent bg-clip-text">
            India
          </span>
        </h1>
      </motion.div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/destination?destination=${encodeURIComponent(item.destination_type)}`} passHref>
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <div className="relative w-full h-[240px]">
                    <Image
                      alt={item.title}
                      src={item.img}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{item.destination_type}</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Starting from {item.price}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}