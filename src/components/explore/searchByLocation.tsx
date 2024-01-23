/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";

import UserType from "@/types/user";

interface LocationProps {
  searchLocation: string;
  setSearchLocation: Dispatch<SetStateAction<string>>;
}
const SearchByLocation: React.FC<LocationProps> = ({
  searchLocation,
  setSearchLocation
}) => {
  const [place, setPlace] = useState<any>();

  useEffect(() => {
    if (!place || !place.address_components) return;
    setSearchLocation(
      place.formatted_address,
    );
  }, [place]);

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full rounded-md outline-none justify-center items-center">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
          onPlaceSelected={(place) => setPlace(place)}
          defaultValue={searchLocation}
          className={`h-full w-full rounded-md
          p-[10px] text-base font-normal text-[#667085] border-[#D0D5DD]`}
          options={{
            types: ["(cities)"],
          }}
          placeholder="Search location"
        />
      </div>
    </div>
  );
};

export default SearchByLocation;

