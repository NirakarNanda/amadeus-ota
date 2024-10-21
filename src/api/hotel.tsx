
import Config from '../../config';
  import axios from "axios";

  export const getHotelsByCity = async (cityCode: string) => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/hotels/by-city/${cityCode}`);
      console.log("Hotels by city data:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotels by city:", error);
      throw error;
    }
  };

  export const getHotelById = async (hotelId: string) => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/hotel/${hotelId}`);
      console.log("Hotel data by ID:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotel by ID:", error);
      throw error;
    }
  };

  export const getMultiHotelOffer = async (hotelId: string, adults: number, checkIn: string) => {
    try {
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/shopping/hotels-offer?hotelId=${hotelId}&adults=${adults}&checkIn=${checkIn}`);
      console.log("Hotel offers:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      throw error;
    }
  };

  export const createHotelOrder = async (orderData: any) => {
    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/amadeus/booking/hotels-orders`, orderData);
      console.log("Hotel order created:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error creating hotel order:", error);
      throw error;
    }
  };

  export const hotelSearch = async (data: any) => {
    const searchKey = data.location ? 'location' : 'destination';
    const searchValue = data.location || data.destination;
  
    try {
      if (searchKey === "location") {
        const result = await axios.post(`${Config.searchUrl}/search`, {
          [searchKey]: searchValue,
        });
        console.log("NLP SEARCH: ", result);
        return result.data;
      } else {
        const Destination = data.destination.toUpperCase();
        const result = await axios.get(`${Config.searchUrl}/pms/property/property-category?destination=${Destination}`);
        return result.data;
      }
    } catch (error) {
      console.error("Error in hotelSearch:", error);
      throw error;
    }
  };
  
  export const roomsByProperty = (id: any) => {
    console.log("Property ID: ", id);
    return new Promise((resolve, reject) => {
      axios.get(`${Config.searchUrl}/pms/room/getRoomsForBooking/${id}`)
        .then((result: any) => {
          console.log("Rooms by property data: ", result.data.data);
          resolve(result.data);
        })
        .catch((error: any) => {
          console.error("Error fetching rooms data:", error);
          reject(error);
        });
    });
  };
  
  export const roomsById = (id: any) => {
    console.log(id)
    return new Promise((resolve, reject) => {
      axios.get(`${Config.searchUrl}/pms/room/${id}`)
        .then((result: any) => {
          resolve(result.data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };
  
  export const getRoomAmenities = async (propertyInfo_id: string) => {
    try {
      const response = await axios.get(`${Config.searchUrl}/pms/amenite/${propertyInfo_id}`);
      console.log("Amenities response:", response.data);
      if (response.data.success) {
        return response.data;
      } else {
        console.error("API returned success: false", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching room amenities:", error);
      return null;
    }
  };