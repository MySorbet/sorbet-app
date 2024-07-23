'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  triggerButton?: React.ReactNode;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
  triggerButton,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          {date?.from || date?.to ? (
            <Button
              id='date'
              variant={'outline'}
              className={cn(
                'px-4 py-2 border border-gray-300 justify-start text-left font-normal'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, yy')} -{' '}
                    {format(date.to, 'LLL dd, yy')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, yy')
                )
              ) : (
                <span>Date</span>
              )}
            </Button>
          ) : triggerButton ? (
            triggerButton
          ) : (
            <span>Select date</span>
          )}
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
