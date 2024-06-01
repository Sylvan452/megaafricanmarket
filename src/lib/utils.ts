import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT'
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

// lib/utils.js

export const calculateShippingCost = (distance: number): number => {
  const freeDistance = 5; // Distance in miles that is free
  const chargePerMile = 0.50; // Charge per mile from the 6th mile onward

  if (distance <= freeDistance) {
    return 0; // Free delivery up to 5 miles
  } else {
    const extraMiles = distance - freeDistance;
    return extraMiles * chargePerMile;
  }
};
