import React, { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filters: FilterState) => void;
  initialFilters: FilterState;
}

interface FilterState {
  amenities: string[];
  priceRange: {
    min: number | undefined;
    max: number | undefined;
  };
  sortOrder: string;
}

const AMENITIES = [
  "Free WiFi",
  "Pool",
  "Spa",
  "Gym",
  "Restaurant",
  "Bar",
  "Room Service",
  "Parking",
  "Airport Shuttle",
  "Business Center",
  "Pet Friendly",
  "Kitchen",
  "Laundry",
  "Air Conditioning",
  "Heating",
  "Family Rooms",
  "Non-smoking Rooms",
  "Disability Access",
  "Beach Access",
  "Mountain View",
] as const;

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFilters,
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters.amenities);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters.priceRange.min);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters.priceRange.max);
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      amenities: selectedAmenities,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      sortOrder,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Amenities Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Minimum Price</label>
              <input
                type="number"
                value={minPrice || ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Min price"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maximum Price</label>
              <input
                type="number"
                value={maxPrice || ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Max price"
              />
            </div>
          </div>
        </div>

        {/* Sort Order Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Sort By</h3>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Rating: High to Low</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </Card>
    </div>
  );
};