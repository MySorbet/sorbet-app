/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";

interface LocationProps {
  userData: any;
  setUserData: any;
  onInputChange: any;
  name: any;
  defaultValue: any;
}
const Location: React.FC<LocationProps> = ({
  userData,
  setUserData,
  onInputChange,
  name,
  defaultValue,
}) => {
  const [place, setPlace] = useState<any>();

  useEffect(() => {
    if (!place || !place.address_components) return;
    const lat = place?.geometry?.location?.lat();
    const lng = place?.geometry?.location?.lng();

    setUserData({
      ...userData,
      tempLocation: place.formatted_address,
    });
    console.log(lat, lng, 'lat');
  }, [place]);

  console.log(place, 'place');

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full rounded-md outline-none justify-center items-center">
        <img src='/svg/location.svg' alt="location" width={20} height={20} className='absolute left-[14px] top-[10px]' />
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
          onPlaceSelected={(place) => setPlace(place)}
          onChange={(e) => onInputChange(e)}
          name={name}
          defaultValue={defaultValue}
          className={`h-full w-full rounded-md
          p-[10px] pl-[42px] text-base font-normal text-[#667085] border-[#D0D5DD]`}
          options={{
            types: ["(cities)"],
          }}
          placeholder="Search location"
        />
      </div>
    </div>
  );
};

export default Location;
