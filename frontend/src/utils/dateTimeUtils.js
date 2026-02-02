// dateTimeUtils.js
import { DateTime } from "luxon";

/**
 * Converts 12-hour time string (e.g., "9:30 PM") to 24-hour "HH:mm" format.
 * Returns "00:00" for invalid input.
 *
 * Note: If your data always comes in 24-hour format (like "21:00:00"), you may not need this.
 */
const convertTo24HourFormat = (time12h) => {
  if (!time12h || typeof time12h !== "string") return "00:00";

  // Try parsing 12-hour format with AM/PM
  let dt = DateTime.fromFormat(time12h.trim(), "h:mm a", {
    zone: "Asia/Kolkata",
  });
  if (!dt.isValid) {
    // If parsing fails, try 24-hour format (HH:mm:ss or HH:mm)
    dt = DateTime.fromFormat(time12h.trim(), "HH:mm:ss", {
      zone: "Asia/Kolkata",
    });
    if (!dt.isValid) {
      dt = DateTime.fromFormat(time12h.trim(), "HH:mm", {
        zone: "Asia/Kolkata",
      });
      if (!dt.isValid) return "00:00";
    }
  }
  return dt.toFormat("HH:mm");
};

/**
 * Formats a date and time string into a readable datetime string in IST timezone.
 * dateStr: "YYYY-MM-DD"
 * timeStr: "HH:mm:ss" or "HH:mm" or 12h format like "9:30 PM"
 * Returns formatted string like "May 29, 2025, 6:45 PM" or "Invalid Date"
 */
const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "Invalid Date";

  // Combine date and time, parse in Asia/Kolkata timezone
  const time24h = convertTo24HourFormat(timeStr);
  const dt = DateTime.fromISO(`${dateStr}T${time24h}`, {
    zone: "Asia/Kolkata",
  });

  if (!dt.isValid) return "Invalid Date";

  return dt.toLocaleString(DateTime.DATETIME_MED);
};

/**
 * Calculates the time left from now until expiration date/time.
 * expirationDate: "YYYY-MM-DD"
 * expirationTime: "HH:mm:ss" or "HH:mm"
 * Returns string like "2 days 3 hours 15 mins" or "Expired" or "Invalid Date"
 */
const timeLeft = (expirationDate, expirationTime) => {
  if (!expirationDate || !expirationTime) return "Invalid Date";

  const time24h = convertTo24HourFormat(expirationTime);
  const expiration = DateTime.fromISO(`${expirationDate}T${time24h}`, {
    zone: "Asia/Kolkata",
  });

  if (!expiration.isValid) return "Invalid Date";

  const now = DateTime.now().setZone("Asia/Kolkata");
  if (expiration <= now) return "Expired";

  const diff = expiration.diff(now, ["days", "hours", "minutes"]).toObject();

  let parts = [];
  if (diff.days >= 1) parts.push(`${Math.floor(diff.days)} days`);
  if (diff.hours >= 1) parts.push(`${Math.floor(diff.hours)} hours`);
  if (diff.minutes >= 1) parts.push(`${Math.floor(diff.minutes)} mins`);

  return parts.join(" ") || "Less than 1m";
};

/**
 * Calculates how much time has passed since a given ISO datetime string.
 * isoDateTimeStr: e.g. "2025-05-27T11:53:12.393263Z"
 * Returns strings like "2 days ago", "3 hours ago", "Just now", "Future date", or "Invalid Date"
 */
const timePast = (isoDateTimeStr) => {
  if (!isoDateTimeStr) return "Invalid Date";

  // Parse in UTC, then convert to IST for display
  const pastDate = DateTime.fromISO(isoDateTimeStr, { zone: "utc" }).setZone(
    "Asia/Kolkata"
  );

  if (!pastDate.isValid) return "Invalid Date";

  const now = DateTime.now().setZone("Asia/Kolkata");

  if (pastDate > now) return "Future date";

  const diff = now
    .diff(pastDate, ["years", "months", "days", "hours", "minutes"])
    .toObject();

  if (diff.years >= 1)
    return diff.years.toFixed(0) === "1"
      ? "1 year ago"
      : `${Math.floor(diff.years)} years ago`;
  if (diff.months >= 1)
    return diff.months.toFixed(0) === "1"
      ? "1 month ago"
      : `${Math.floor(diff.months)} months ago`;
  if (diff.days >= 1)
    return diff.days.toFixed(0) === "1"
      ? "1 day ago"
      : `${Math.floor(diff.days)} days ago`;
  if (diff.hours >= 1)
    return diff.hours.toFixed(0) === "1"
      ? "1 hour ago"
      : `${Math.floor(diff.hours)} hours ago`;
  if (diff.minutes >= 1)
    return diff.minutes.toFixed(0) === "1"
      ? "1 minute ago"
      : `${Math.floor(diff.minutes)} minutes ago`;

  return "Just now";
};

/**
 * Checks if a donation is expired based on expiration date/time.
 * expirationDate: "YYYY-MM-DD"
 * expirationTime: "HH:mm:ss" or "HH:mm"
 * Returns true if expired or invalid, false otherwise.
 */
const isExpired = (expirationDate, expirationTime) => {
  if (!expirationDate || !expirationTime) return true;

  const time24h = convertTo24HourFormat(expirationTime);
  const expiration = DateTime.fromISO(`${expirationDate}T${time24h}`, {
    zone: "Asia/Kolkata",
  });

  if (!expiration.isValid) return true;

  const now = DateTime.now().setZone("Asia/Kolkata");
  return expiration <= now;
};

/**
 * Calculates how much time has passed since expiration date/time.
 * expirationDate: "YYYY-MM-DD"
 * expirationTime: "HH:mm:ss" or "HH:mm"
 * Returns strings like "2 days ago", "3 hours ago", "Just now", or "Invalid Date"
 */
const timeExpired = (expirationDate, expirationTime) => {
  if (!expirationDate || !expirationTime) return "Invalid Date";

  const time24h = convertTo24HourFormat(expirationTime);
  const expiration = DateTime.fromISO(`${expirationDate}T${time24h}`, {
    zone: "Asia/Kolkata",
  });

  if (!expiration.isValid) return "Invalid Date";

  const now = DateTime.now().setZone("Asia/Kolkata");

  if (expiration > now) return "Not expired yet";

  const diff = now
    .diff(expiration, ["years", "months", "days", "hours", "minutes"])
    .toObject();

  if (diff.years >= 1)
    return diff.years.toFixed(0) === "1"
      ? "1 year ago"
      : `${Math.floor(diff.years)} years ago`;
  if (diff.months >= 1)
    return diff.months.toFixed(0) === "1"
      ? "1 month ago"
      : `${Math.floor(diff.months)} months ago`;
  if (diff.days >= 1)
    return diff.days.toFixed(0) === "1"
      ? "1 day ago"
      : `${Math.floor(diff.days)} days ago`;
  if (diff.hours >= 1)
    return diff.hours.toFixed(0) === "1"
      ? "1 hour ago"
      : `${Math.floor(diff.hours)} hours ago`;
  if (diff.minutes >= 1)
    return diff.minutes.toFixed(0) === "1"
      ? "1 minute ago"
      : `${Math.floor(diff.minutes)} minutes ago`;

  return "Just now";
};

const convertTo12HourFormat = (time24h) => {
  if (!time24h) return "";

  const [hours, minutes] = time24h.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function for date/time validation
const isInPast = (date, time12h) => {
  if (!date || !time12h) return false;

  const now = new Date();
  const expirationDate = new Date(date);

  // Set the time component
  const time24h = convertTo24HourFormat(time12h);
  const [hours, minutes] = time24h.split(":");
  expirationDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  return expirationDate < now;
};

export {
  convertTo24HourFormat,
  convertTo12HourFormat,
  formatDateTime,
  timeLeft,
  timePast,
  isExpired,
  timeExpired,
  isInPast,
};
