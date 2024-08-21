import { Library } from '@googlemaps/js-api-loader';
import { useLoadScript } from '@react-google-maps/api';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

const libs: Library[] = ['places', 'core', 'maps', 'marker'];

export const useGooglePlacesApi = (showEditModal: boolean) => {
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[] | []
  >([]);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );

  const { isLoaded } = useLoadScript({
    id: 'sorbet-google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
    libraries: libs,
  });

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setPredictions([]);
      return;
    }

    if (!autocompleteRef.current || !autocompleteRef) {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
    }

    autocompleteRef.current.getPlacePredictions(
      { input: e.target.value, types: ['(cities)'] },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        console.log(predictions);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions || []);
        }
      }
    );
  };

  const handleLocationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setPredictions([]);
    }
  };

  useEffect(() => {
    if (!showEditModal) {
      setPredictions([]);
    }
  }, [showEditModal]);

  return {
    predictions,
    setPredictions,
    handleLocationInputChange,
    handleLocationKeyDown,
  };
};
