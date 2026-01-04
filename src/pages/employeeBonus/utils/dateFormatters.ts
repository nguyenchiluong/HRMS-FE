import { format } from "date-fns";

export const toDateString = (date: Date): string =>
  format(date, "yyyy-MM-dd");

export const formatDate = (date: string): string =>
  format(new Date(date), "dd MMM yyyy");

export const formatTime = (date: string): string =>
  format(new Date(date), "HH:mm");

export const formatDateTime = (date: string): string =>
  format(new Date(date), "dd MMM yyyy HH:mm");

export const truncateText = (text: string, max = 60): string =>
  text.length > max ? `${text.slice(0, max)}…` : text;
