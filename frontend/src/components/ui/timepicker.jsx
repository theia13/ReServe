import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

const TimePicker = ({ onChange, value, className }) => {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState("AM");
  const [selectedTime, setSelectedTime] = useState(null);

  const minutesList = [0, 15, 30, 45];

  useEffect(() => {
    if (value) {
      const [time, timePeriod] = value.split(" ");
      const [hoursStr, minutesStr] = time.split(":");
      setHours(parseInt(hoursStr, 10));
      setMinutes(parseInt(minutesStr, 10));
      setPeriod(timePeriod);
    } else {
      setSelectedTime(null);
    }
  }, [value]);

  useEffect(() => {
    if (selectedTime) {
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
      onChange?.(formattedTime);
    }
  }, [hours, minutes, period, onChange, selectedTime]);

  const incrementHour = () => setHours((prev) => (prev === 12 ? 1 : prev + 1));
  const decrementHour = () => setHours((prev) => (prev === 1 ? 12 : prev - 1));
  const incrementMinute = () =>
    setMinutes(
      (prev) =>
        minutesList[(minutesList.indexOf(prev) + 1) % minutesList.length]
    );
  const decrementMinute = () =>
    setMinutes(
      (prev) =>
        minutesList[
          (minutesList.indexOf(prev) - 1 + minutesList.length) %
            minutesList.length
        ]
    );
  const togglePeriod = () => setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")} ${period}`;
          setSelectedTime(formattedTime);
          onChange?.(formattedTime);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full pl-3 text-left text-sm font-normal ${
            !selectedTime ? "text-muted-foreground" : ""
          }`}
          onClick={() => setOpen(true)}
        >
          {selectedTime || <span>Select Time</span>}
          <Clock className="ml-auto h-4 w-4 opacity-20" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="p-3 text-center w-56"
      >
        <div className="flex justify-center space-x-3">
          <div className="text-center">
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={incrementHour}
            >
              <ChevronUp className="w-6 h-6 opacity-20" />
            </button>
            <div className="text-lg font-medium">
              {hours.toString().padStart(2, "0")}
            </div>
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={decrementHour}
            >
              <ChevronDown className="w-6 h-6 opacity-20" />
            </button>
          </div>
          <div className="text-lg mt-8">:</div>
          <div className="text-center">
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={incrementMinute}
            >
              <ChevronUp className="w-6 h-6 opacity-20" />
            </button>
            <div className="text-lg font-medium">
              {minutes.toString().padStart(2, "0")}
            </div>
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={decrementMinute}
            >
              <ChevronDown className="w-6 h-6 opacity-20" />
            </button>
          </div>
          <div className="text-center mt-8 pl-4">
            <button
              className="text-sm bg-primary text-primary-foreground p-1.5 rounded-md"
              onClick={togglePeriod}
            >
              {period}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
