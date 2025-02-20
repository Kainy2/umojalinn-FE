import { format } from "timeago.js";

export function categorizeDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, now)) {
    return "Today";
  } else if (isSameDay(date, yesterday)) {
    return "Yesterday";
  } else if (date > lastWeek) {
    return "Last Week";
  } else if (date > lastMonth) {
    return "Last Month";
  } else {
    return format(date);
  }
}
