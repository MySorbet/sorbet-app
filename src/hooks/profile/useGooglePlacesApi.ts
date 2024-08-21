import { Library } from '@googlemaps/js-api-loader';
import { useJsApiLoader } from '@react-google-maps/api';
import { RefObject, useEffect, useState } from 'react';

const libs: Library[] = ['places', 'core', 'maps', 'marker'];

export const useGooglePlacesApi = (
  placesAutocompleteRef: RefObject<HTMLInputElement>
) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  useEffect(() => {
    if (isLoaded && placesAutocompleteRef && placesAutocompleteRef.current) {
      console.log(
        'placesAutocompleteRef.current',
        placesAutocompleteRef.current
      );
      const gAutoComplete = new google.maps.places.Autocomplete(
        placesAutocompleteRef.current as HTMLInputElement
      );
      console.log('gAutoComplete', gAutoComplete);
      setAutocomplete(gAutoComplete);
    }
  }, [isLoaded, placesAutocompleteRef]);

  return { autocomplete, isLoaded };
};
