import React, { useState } from "react";
import { FaSearch, FaWifi, FaSnowflake, FaParking } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

interface HeaderProps {
  tag: string;
}

const Header: React.FC<HeaderProps> = ({ tag }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string>("Search");
  const [sort, setSort] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

  const allFilters = [
    "Free cancellation",
    "Kitchen",
    "Washer",
    "Iron",
    "Bar and Lounge",
    "Business facilities",
    "Child Friendly Facilities",
    "Concierge Services",
    "Fitness Center",
    "Laundry Services",
    "Parking",
    "Restaurant",
    "Room Service",
    "Wifi",
    "Dedicated workspace",
    "Dryer",
    "Swimming Pool",
    "Spa and Wellness",
    "Hot tub",
    "Gym",
    "Breakfast",
    "Pets allowed",
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const saveFilters = () => {
    setIsModalOpen(false);
  };

  const renderAmenity = (amenity: string, IconComponent: React.ElementType) => (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer ${
        selectedFilters.includes(amenity)
          ? "bg-green-500 text-white"
          : "text-gray-700"
      }`}
      onClick={() => toggleFilter(amenity)}
    >
      <IconComponent />
      <span className="text-sm">{amenity}</span>
    </div>
  );

  return (
    <>
      <div className="bg-white py-4 sm:py-6 w-full">
        {/* Main container that ensures no horizontal overflow */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          {/* Search Input and Filter Button */}
          <div className="flex items-center justify-between relative w-full">
            {/* Input and Search Icon */}
            <div className="relative w-full max-w-[225px]">
              <input
                className="block sm:p-2 w-full p-3 h-[50px] rounded-3xl border-2 text-gray-900 placeholder:text-gray-400"
                type="text"
                placeholder={searchOption}
                onFocus={() => setSearchOption("")}
                onBlur={() => setSearchOption("Search")}
              />
              <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer shadow-sm bg-rose-600 flex aspect-square flex-col w-8 h-8 px-1.5 rounded-full text-white" />
            </div>

            {/* Filters Button */}
            <div
              className="ml-4 items-center h-[50px] border border-gray-200 shadow-lg bg-blue-500 hover:bg-blue-400 text-white flex gap-2 px-4 py-2 rounded-full cursor-pointer w-max"
              onClick={openModal}
            >
              <IoIosOptions />
              <div className="text-white text-sm leading-5">Filters</div>
            </div>
          </div>
        </div>
      </div>

      <div className="items-stretch shadow-sm bg-white flex w-full flex-col px-4 py-4 md:px-6">
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Other Amenities</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {allFilters.map((filter) => (
                  <div
                    key={filter}
                    className={`text-sm leading-5 whitespace-nowrap justify-center items-stretch border shadow-sm px-4 py-2 rounded-full border-solid cursor-pointer ${
                      selectedFilters.includes(filter)
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-[color:var(--gray-200,#E5E7EB)]"
                    }`}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-4">Sort by Price</h2>

              <div className="flex flex-col gap-2 mb-4">
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="asc">Low to High</option>
                  <option value="dsc">High to Low</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="text-gray-700">Minimum Price:</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1"
                  placeholder="Min price"
                />
                <label className="text-gray-700">Maximum Price:</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1"
                  placeholder="Max price"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={saveFilters}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;