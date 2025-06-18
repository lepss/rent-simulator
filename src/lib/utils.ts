import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseValue = (v: string) => {
  const clean = v.replace(/\s/g, "");
  const number = parseFloat(clean);
  return isNaN(number) ? 0 : number;
};

export const formatNumber = (value: number | string) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const unformatNumber = (value: string) =>
  value.replace(/\s/g, "").replace(/[^\d]/g, "");
