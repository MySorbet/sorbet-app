import { MarkerPin02 } from '@untitled-ui/icons-react';
import { Dispatch, SetStateAction } from 'react';
import {
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import { Command, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { useGooglePlacesApi } from '@/hooks';
import { cn } from '@/lib/utils';

interface LocationInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  /** Styles only the shadcn input component */
  className?: string;
}

/**
 * @param className styles only the input component.
 * @returns an input component interacting with Google Places API, designed to be used with React Hook Form
 */
export const LocationInput = <T extends FieldValues>({
  name,
  register,
  setValue,
  className,
}: LocationInputProps<T>) => {
  const { predictions, setPredictions, handleLocationInputChange } =
    useGooglePlacesApi();

  return (
    <div className='relative'>
      <Command>
        <div className='relative'>
          <Input
            id='location-input'
            type='text'
            placeholder='Type a location'
            {...register(name, {
              required: 'Location is required',
            })}
            onChange={(e) => {
              setValue(name, e.target.value as PathValue<T, Path<T>>, {
                shouldDirty: true,
              });
              handleLocationInputChange(e);
            }}
            autoComplete='off'
            className={cn('pl-10 focus:outline-none focus:ring-0', className)}
          />
          <MarkerPin02 className='absolute left-3 top-[10px] h-5 w-5 text-[#667085]' />
        </div>
        <LocationPredictionsList
          name={name}
          predictions={predictions}
          setValue={setValue}
          setPredictions={setPredictions}
        />
      </Command>
    </div>
  );
};

interface LocationPredictionsListProps<T extends FieldValues> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  setPredictions: Dispatch<
    SetStateAction<google.maps.places.AutocompletePrediction[]>
  >;
  predictions: google.maps.places.AutocompletePrediction[];
}

/**
 * This component renders the list of predictions that is returned from interfacing with the Google Places API.
 * Eventually, we want to make these animations match the shadcn 'popover' animations for consistency reasons.
 * Currently, it matches on 'enter', but the 'exit' animations are not taking effect.
 */
const LocationPredictionsList = <T extends FieldValues>({
  name,
  predictions,
  setValue,
  setPredictions,
}: LocationPredictionsListProps<T>) => {
  const isShown = predictions.length > 0;

  return (
    <CommandList
      data-shown={isShown}
      className={cn(
        'absolute top-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 text-black drop-shadow-xl',
        'data-[shown=true]:animate-in data-[shown=true]:fade-in-0 data-[shown=true]:zoom-in-95 data-[shown=true]:slide-in-from-top-2',
        // TODO: Goal is to use the line below to properly animate the exit of the predictions list
        // 'data-[shown=false]:animate-out data-[shown=false]:fade-out-0 data-[shown=false]:zoom-out-95 data-[shown=false]:slide-out-to-top-2',
        !isShown && 'mt-0 border-0 p-0'
      )}
    >
      {predictions.map((prediction) => (
        <CommandItem
          key={prediction.place_id}
          value={prediction.description}
          onSelect={() => {
            setValue(name, prediction.description as PathValue<T, Path<T>>, {
              shouldDirty: true,
            });
            setPredictions([]);
          }}
          className=' text-black'
        >
          {prediction.description}
        </CommandItem>
      ))}
    </CommandList>
  );
};
