// import axios from "axios";
// import Config from '../../config';

// export const hotelSearch = async (data: any) => {
//   const searchKey = data.location ? 'location' : 'destination';
//   const searchValue = data.location || data.destination;

//   try {
//     if (searchKey === "location") {
//       const result = await axios.post(`${Config.searchUrl}/search`, {
//         [searchKey]: searchValue,
//       });
//       console.log("NLP SEARCH: ", result);
//       return result.data;
//     } else {
//       const Destination = data.destination.toUpperCase();
//       const result = await axios.get(`${Config.searchUrl}/pms/property/property-category?destination=${Destination}`);
//       return result.data;
//     }
//   } catch (error) {
//     console.error("Error in hotelSearch:", error);
//     throw error;
//   }
// };

// export const roomsByProperty = (id: any) => {
//   console.log("Property ID: ", id);
//   return new Promise((resolve, reject) => {
//     axios.get(`${Config.searchUrl}/pms/room/getRoomsForBooking/${id}`)
//       .then((result: any) => {
//         console.log("Rooms by property data: ", result.data.data);
//         resolve(result.data);
//       })
//       .catch((error: any) => {
//         console.error("Error fetching rooms data:", error);
//         reject(error);
//       });
//   });
// };

// export const roomsById = (id: any) => {
//   console.log(id)
//   return new Promise((resolve, reject) => {
//     axios.get(`${Config.searchUrl}/pms/room/${id}`)
//       .then((result: any) => {
//         resolve(result.data);
//       })
//       .catch((error: any) => {
//         reject(error);
//       });
//   });
// };



// // export const roomAmenities = (roomId: string) => {
// //   return new Promise((resolve, reject) => {
// //     axios.get(`${Config.searchUrl}/pms/room/room-amenity/${roomId}`)
// //       .then((result: any) => {
// //         console.log("Room amenities data: ", result.data);
// //         resolve(result.data);
// //       })
// //       .catch((error: any) => {
// //         console.error("Error fetching room amenities:", error);
// //         reject(error);
// //       });
// //   });
// // };

// // import axios from "axios";
// // import Config from '../../config';

// // export const hotelSearch = (data: any) => {
// //   const searchKey = data.location ? 'location' : 'destination';
// //   const searchValue = data.location || data.destination;

// //   console.log("Data destination: ", data.destination);
// //   console.log("Search value: ", searchKey, searchValue);


// //     console.log("the search value",searchKey,searchValue)
// //     if (searchKey == "location"){
// //       return new Promise((resolve, reject) => {
// //         axios
// //           .post(`${Config.searchUrl}/${data.url}`, {
// //             [searchKey]: searchValue,
// //             //capacity:2
// //           })
// //           .then((result: any) => {
// //             resolve(result.data);
// //             console.log("all hotel data",result.data)
// //           })
// //           .catch((error: any) => {
// //             console.error("Error in hotelSearch:", error);
// //             reject(error);
// //           });
// //       });
// //     }
  
// //     return new Promise((resolve, reject) => {
// //       const Data = data.destination
// //       const Destination = Data.toUpperCase()
// //       console.log(Destination)
// //       axios
// //         // .post(`${Config.searchUrl}/${data.url}`, {
// //         //   [searchKey]: searchValue,
// //         // })
// //         .get(`${Config.searchUrl}/pms/property/property-category?destination=${Destination}`)
// //         .then((result: any) => {
// //           resolve(result.data);
// //           // console.log("all hotel data",result.data)
// //         })
// //         .catch((error: any) => {
// //           console.error("Error in hotelSearch:", error);
// //           reject(error);
// //         });
// //     });
// //   }

 

// // export const roomsByProperty = (id: any) => {
// //   console.log("Property ID: ", id);
// //   return new Promise((resolve, reject) => {
// //     axios.get(`${Config.searchUrl}/pms/room/rooms_by_propertyId/${id}`)
// //       .then((result: any) => {
// //         console.log("Rooms by property data: ", result.data.data);
// //         resolve(result.data);
// //       })
// //       .catch((error: any) => {
// //         console.error("Error fetching rooms data:", error);
// //         reject(error);
// //       });
// //   });
// // };

// // export const roomsById = (id: any) => {
// //   console.log(id)
// //   return new Promise((resolve, reject) => {
// //     axios.get(`${Config.searchUrl}/pms/room/${id}`)
// //       .then((result: any) => {
// //         resolve(result.data);
// //       })
// //       .catch((error: any) => {
// //         reject(error);
// //       });
// //   });
// // };



// // export const roomAmenities = (roomId: string) => {
// //   return new Promise((resolve, reject) => {
// //     axios.get(`${Config.searchUrl}/pms/room/room-amenity/${roomId}`)
// //       .then((result: any) => {
// //         console.log("Room amenities data: ", result.data);
// //         resolve(result.data);
// //       })
// //       .catch((error: any) => {
// //         console.error("Error fetching room amenities:", error);
// //         reject(error);
// //       });
// //   });
// // };

  import axios from "axios";
  require('dotenv').config();

  // Amadeus API Endpoints
  export const getAccessToken = async () => {
    try {
      const result = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,     // Using environment variable for API key
        client_secret: process.env.AMADEUS_API_SECRET // Using environment variable for API secret
      });
      return result.data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  };

  export const getHotelsByCity = async (cityCode: string) => {
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/amadeus/hotels/by-city/${cityCode}`);
      console.log("Hotels by city data:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotels by city:", error);
      throw error;
    }
  };

  export const getHotelById = async (hotelId: string) => {
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/amadeus/hotel/${hotelId}`);
      console.log("Hotel data by ID:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotel by ID:", error);
      throw error;
    }
  };

  export const getMultiHotelOffer = async (hotelId: string, adults: number, checkIn: string) => {
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/amadeus/shopping/hotels-offer?hotelId=${hotelId}&adults=${adults}&checkIn=${checkIn}`);
      console.log("Hotel offers:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      throw error;
    }
  };

  export const createHotelOrder = async (orderData: any) => {
    try {
      const result = await axios.post('http://localhost:8080/api/v1/amadeus/booking/hotels-orders', orderData);
      console.log("Hotel order created:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error creating hotel order:", error);
      throw error;
    }
  };

