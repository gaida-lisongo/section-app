import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const standardFormat = (value: number) => {
  return value.toFixed(0);
};

export const formatWithDecimals = (value: number, decimals: number) => {
  return value.toFixed(decimals);
};
