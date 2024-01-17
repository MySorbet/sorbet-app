import axios from 'axios';

interface Location {
  lat: number;
  lng: number;
}

export const getCoordinatesFromFormattedAddress = async (
  formattedAddress: string
): Promise<Location | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        formattedAddress
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`
    );

    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error('Error fetching coordinates: ', error);
    return null;
  }
};