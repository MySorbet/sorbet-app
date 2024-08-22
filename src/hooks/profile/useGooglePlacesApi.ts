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

  /**
   * Load the Google Maps API script
   * Extracting error state to only log the error. We still want users to be able to fill out the field, so we don't want to throw.
   */
  const { loadError } = useLoadScript({
    id: 'sorbet-google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
    libraries: libs,
  });

  /**
   * Handler that calls Google Places API to get predictions based on the input value
   * Only cities are allowed at the moment. Can easily be changed to allow other types of places.
   */
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

  /**
   * For when a user presses enter, we want to clear the predictions so the flow of moving on to the next field is smooth
   */
  const handleLocationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setPredictions([]);
    }
  };

  /**
   * Clear predictions when the edit modal is closed so it doesnt appear when the user opens the modal again
   */
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
    loadError
  };
};