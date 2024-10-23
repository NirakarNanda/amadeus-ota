"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ParisImage from "../assets/popular/paris.jpg";
import NewYorkImage from "../assets/popular/new-york.jpg";
import TokyoImage from "../assets/popular/tokyo.jpg";
import JaipurImage from "../assets/popular/jaipur.jpg";
import DubaiImage from "../assets/popular/dubai.jpg";
import SydneyImage from "../assets/popular/sydney.jpg";
import VeniceImage from "../assets/popular/vanice.jpg";
import GoaImage from "../assets/popular/goa.jpg";
import BangkokImage from "../assets/popular/bangkok.jpg";
import SingaporeImage from "../assets/popular/singapore.jpg";
import LondonImage from "../assets/popular/london.jpg";
import RomeImage from "../assets/popular/rome.jpg";




const InfiniteDestinationCarousel = () => {
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<number | null>(null);
  const [visibleSlides, setVisibleSlides] = useState(3);

  const destinations = [
    {
      title: "Paris, France",
      description:
        "The City of Light is known for its art, fashion, and culture. Explore the iconic Eiffel Tower, world-class museums like the Louvre, and stroll along the charming streets of Montmartre.",
      highlight: "World's most visited city",
      image: ParisImage,
    },
    {
      title: "New York City, USA",
      description:
        "A city that needs no introduction, NYC offers endless possibilities—from Broadway shows, Times Square, Central Park, and the Statue of Liberty. It’s the city that never sleeps.",
      highlight: "Iconic skyline & culture",
      image: NewYorkImage,
    },
    {
      title: "Jaipur, India",
      description:
        "The Pink City is known for its majestic palaces, forts, and vibrant markets. Explore the Amer Fort, City Palace, and enjoy the rich culture and heritage of Rajasthan.",
      highlight: "Royal Palaces & History",
      image: JaipurImage,
    },
    {
      title: "Goa, India",
      description:
        "Famous for its golden beaches, vibrant nightlife, and Portuguese heritage, Goa is the perfect getaway for relaxation and fun. Don't miss the beautiful churches and lively beach shacks.",
      highlight: "Beaches & Nightlife",
      image: GoaImage,
    },
    {
      title: "Venice, Italy",
      description:
        "Famed for its romantic canals, gondolas, and Renaissance architecture, Venice offers a magical experience. Visit the St. Mark's Basilica, Grand Canal, and Piazza San Marco.",
      highlight: "City of Canals",
      image: VeniceImage,
    },
    {
      title: "Dubai, UAE",
      description:
        "Dubai is a city of superlatives, from the tallest building, the Burj Khalifa, to luxurious shopping malls, artificial islands, and desert safaris. It's a blend of modernity and tradition.",
      highlight: "Luxury & Modern Wonders",
      image: DubaiImage,
    },
    {
      title: "Sydney, Australia",
      description:
        "Sydney is known for its stunning harbor, iconic Opera House, and beaches like Bondi. Enjoy world-class dining, surfing, and explore the Blue Mountains and wildlife parks.",
      highlight: "Harbor & Beaches",
      image: SydneyImage,
    },
    {
      title: "Bangkok, Thailand",
      description:
        "Thailand's bustling capital is famous for its street life, ornate temples, and vibrant nightlife. Explore the Grand Palace, Wat Pho, and enjoy authentic Thai cuisine.",
      highlight: "Vibrant Street Life & Temples",
      image: BangkokImage,
    },
    {
      title: "Singapore",
      description:
        "A futuristic city-state, Singapore boasts iconic landmarks like Marina Bay Sands, Gardens by the Bay, and Sentosa Island. Experience a mix of cultures and futuristic innovations.",
      highlight: "Futuristic City & Gardens",
      image: SingaporeImage,
    },
    {
      title: "London, UK",
      description:
        "A global city with a rich history, London offers famous landmarks such as Big Ben, Buckingham Palace, the Tower of London, and diverse cultural experiences.",
      highlight: "Historical Landmarks & Culture",
      image: LondonImage,
    },
    {
      title: "Rome, Italy",
      description:
        "Rome, the Eternal City, is renowned for its ancient ruins, including the Colosseum and Roman Forum. Discover its rich history, art, and world-famous cuisine.",
      highlight: "Ancient Ruins & History",
      image: RomeImage,
    },
    {
      title: "Tokyo, Japan",
      description:
        "A seamless blend of modern and traditional, Tokyo offers dazzling skyscrapers alongside tranquil temples and gardens. Experience cutting-edge technology, sushi, and ancient history all in one.",
      highlight: "Technology & Temples",
      image: TokyoImage,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Update visible slides based on screen size
  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth < 640) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = window.setInterval(() => {
        handleNext();
      }, 3000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex < 0) {
        return destinations.length - visibleSlides;
      }
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex > destinations.length - visibleSlides) {
        return 0;
      }
      return newIndex;
    });
  };

  return (
    <div className="mt-16 px-4 max-w-7xl mx-auto">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
          Travel with Trip-Swift
        </h2>
        <hr className="w-48 mx-auto border-t-2 border-gray-400 mb-2" />
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-4xl font-bold transition-transform duration-500 hover:scale-110">
          Around the popular destinations on the world
        </p>
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Container */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
            }}
          >
            {destinations.map((dest, index) => (
              <div
                key={index}
                className={`flex-shrink-0 px-4 transition-all duration-300 ${
                  visibleSlides === 1 ? 'w-full' : 
                  visibleSlides === 2 ? 'w-1/2' : 'w-1/3'
                }`}
              >
                <div className="relative group h-[24rem] rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                  <img
                    src={dest.image.src}
                    alt={dest.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {dest.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        {dest.description}
                      </p>
                      <span className="inline-block text-white/90 text-xs px-3 py-1 bg-white/20 rounded-full">
                        {dest.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots - Only show for visible section */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(Math.ceil(destinations.length / visibleSlides))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * visibleSlides)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / visibleSlides) === index
                  ? "bg-blue-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteDestinationCarousel;