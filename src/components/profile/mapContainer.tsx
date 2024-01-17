import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

import { getCoordinatesFromFormattedAddress } from '@/utils/geocode';

interface MapContainerProps {
  locationName: string;
}

const MapContainer: React.FC<MapContainerProps> = ({ locationName }) => {
  const [location, setLocation] = useState({
    lat: 51.5072178,
    lng: -0.1275862,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coordinates = await getCoordinatesFromFormattedAddress(
        locationName
      );
      console.log(coordinates, 'coordinates');
      if (coordinates) {
        setLocation(coordinates);
      }
    };

    fetchCoordinates();
  }, [locationName]);

  const mapStyles = {
    height: '30vh',
    width: '100%',
  };

  const mapOptions = {

  }

  console.log(location, 'location');
  const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=10&size=800x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`;
  return (
    <div
      className='h-[300px] w-full rounded-[32px]'
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
  );
};

export default MapContainer;
