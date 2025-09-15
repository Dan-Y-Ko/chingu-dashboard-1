"use client";

import React from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import "react-datepicker/dist/react-datepicker.css";

import TextInput from "./TextInput";

export interface DatePickerInputProps {
  id: string;
  label: string;
  selectedValue?: Date;
  placeholder: string;
  errorMessage?: string | undefined;
  className?: string;
  onChange?: (date: Date | null) => void;
}

function DateTimePicker(
  {
    id,
    label,
    selectedValue,
    placeholder,
    errorMessage,
    className = "",
    ...props
  }: DatePickerInputProps
) {
  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };
  return (
    <div className="flex w-full flex-col">
      <ReactDatePicker
        id={id}
        selected={selectedValue}
        placeholderText={placeholder}
        showTimeSelect
        filterTime={filterPassedTime}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeIntervals={15}
        popperClassName="ml-1"
        popperPlacement="bottom-start"

        customInput={
          <TextInput
            id={id}
            label={label}
            placeholder=""
            inputGroupContent={<CalendarDaysIcon />}
            errorMessage={errorMessage}
            className={className}
          />
        }
        {...props}
      />
    </div>
  );
}

DateTimePicker.displayName = "DateTimePicker";

export default DateTimePicker;
