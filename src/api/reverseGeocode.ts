// utils/reverseGeocode.ts
import axios from 'axios';

export interface ReverseGeocodeResponse {
  display_name: string;
}

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await axios.get<ReverseGeocodeResponse>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
        },
        headers: {
          'Accept-Language': 'en', 
        },
      }
    );

    return response.data.display_name;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Address not available';
  }
};
