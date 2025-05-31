import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

const TimePicker = ({ onChange, value, className, selectedDate }) => {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState("AM");
  const [selectedTime, setSelectedTime] = useState(null);

  const minutesList = [0, 15, 30, 45];

  // Get current date and time for validation
  const now = new Date();
  const isToday =
    selectedDate &&
    new Date(selectedDate).toDateString() === now.toDateString();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Parse time value if it exists
  useEffect(() => {
    if (value) {
      const [time, timePeriod] = value.split(" ");
      const [hoursStr, minutesStr] = time.split(":");
      setHours(parseInt(hoursStr, 10));
      setMinutes(parseInt(minutesStr, 10));
      setPeriod(timePeriod);
      setSelectedTime(value);
    } else {
      // Default to current time plus 1 hour if no value
      if (!selectedTime && isToday) {
        let defaultHour = currentHour + 1;
        const defaultPeriod = defaultHour >= 12 ? "PM" : "AM";
        defaultHour =
          defaultHour > 12
            ? defaultHour - 12
            : defaultHour === 0
            ? 12
            : defaultHour;

        // Round minutes to next 15-minute interval
        const defaultMinute = (Math.ceil(currentMinute / 15) * 15) % 60;

        setHours(defaultHour);
        setMinutes(defaultMinute);
        setPeriod(defaultPeriod);
      }
    }
  }, [value, selectedDate]);

  // Convert 12-hour format to 24-hour for comparisons
  const to24Hour = (h, p) => {
    return p === "AM" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
  };

  // Check if a time is valid (not in the past for today)
  const isTimeValid = (h, m, p) => {
    if (!isToday) return true;

    const hour24 = to24Hour(h, p);
    if (hour24 > currentHour) return true;
    if (hour24 < currentHour) return false;

    // Same hour, check minutes
    return m >= Math.ceil(currentMinute / 15) * 15;
  };

  const incrementHour = () => {
    setHours((prev) => (prev === 12 ? 1 : prev + 1));
  };

  const decrementHour = () => {
    setHours((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const incrementMinute = () => {
    const nextIndex = (minutesList.indexOf(minutes) + 1) % minutesList.length;
    setMinutes(minutesList[nextIndex]);
  };

  const decrementMinute = () => {
    const prevIndex =
      (minutesList.indexOf(minutes) - 1 + minutesList.length) %
      minutesList.length;
    setMinutes(minutesList[prevIndex]);
  };

  const togglePeriod = () => {
    setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  const applyTime = () => {
    if (isTimeValid(hours, minutes, period)) {
      setSelectedTime(formattedTime);
      onChange?.(formattedTime);
      setOpen(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && selectedTime) {
          onChange?.(selectedTime);
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
        className="p-3 text-center w-60"
      >
        <div className="flex justify-center space-x-3">
          {/* Hours */}
          <div className="text-center">
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={incrementHour}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="text-lg font-medium">
              {hours.toString().padStart(2, "0")}
            </div>
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={decrementHour}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <div className="text-lg mt-8">:</div>

          {/* Minutes */}
          <div className="text-center">
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={incrementMinute}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="text-lg font-medium">
              {minutes.toString().padStart(2, "0")}
            </div>
            <button
              className="text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={decrementMinute}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Period */}
          <div className="text-center mt-8 pl-4">
            <button
              className={`text-sm p-1.5 rounded-md ${
                period === "AM"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200"
              } mr-1`}
              onClick={() => setPeriod("AM")}
            >
              AM
            </button>
            <button
              className={`text-sm p-1.5 rounded-md ${
                period === "PM"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200"
              }`}
              onClick={() => setPeriod("PM")}
            >
              PM
            </button>
          </div>
        </div>

        {isToday && !isTimeValid(hours, minutes, period) && (
          <div className="text-red-500 text-xs mt-2">
            Please select a future time
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            onClick={applyTime}
            disabled={isToday && !isTimeValid(hours, minutes, period)}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
