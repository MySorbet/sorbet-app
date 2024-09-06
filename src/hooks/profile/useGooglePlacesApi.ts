import { Library } from '@googlemaps/js-api-loader';
import { useLoadScript } from '@react-google-maps/api';
import { debounce } from 'lodash';
import { ChangeEvent, useRef, useState } from 'react';

import { config } from '@/lib/config';

const libs: Library[] = ['places', 'core', 'maps', 'marker'];

export const useGooglePlacesApi = () => {
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
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
    googleMapsApiKey: config.googleMapKey,
    libraries: libs,
  });

  /**
   * Handler that calls Google Places API to get predictions based on the input value with 300ms debounce
   * Only cities are allowed at the moment. Can easily be changed to allow other types of places.
   */
  const handleLocationInputChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setPredictions([]);
      return;
    }

    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
    }

    autocompleteRef.current.getPlacePredictions(
      { input: e.target.value, types: ['(cities)'] },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions || []);
        }
      }
    );
  }, 300);

  /**
   * Clear predictions when the edit modal is closed so it doesnt appear when the user opens the modal again
   */

  return {
    predictions,
    setPredictions,
    handleLocationInputChange,
    loadError,
  };
};
