import axios from "axios";
import Config from '../../config'

type BookingType = {
  property: string;
  room: string;
  user: string;
  booking_user_name:string
  booking_user_email:string,
  booking_user_phone:Number,
  amount: Number;
  payment:string;
  booking_dates: Date;
  status: string;
  checkInDate: Date;
  checkOutDate: Date;
  reviews: string;
  createdAt: Date;
  updatedAt: Date;
  };
const createBooking = (data:BookingType) =>{
    
    return new Promise ((resolve, reject)=>{
        axios.post(`${Config.bookingUrl}/createreservation`,{
            data
        })
        .then((result:any)=>{
            resolve(result.data)
        })
        .catch((error:any)=>{
            reject(error)
        })
    })
};

export const deleteBooking = async (id: string, accessToken: string) => {
    if (!id) {
        console.log("Id is required");
        return;
    }
    try {
        const { data } = await axios.delete(`${Config.searchUrl}/booking/${id}`, {
            headers:{
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return data;
    } catch (error: any) {
        console.error("Error deleting booking:", error);    
    }
}