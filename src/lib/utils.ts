import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getDiscountPercentage(originalPrice: number, salePrice: number) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

import { getPlatformColor as getPlatformColorFromConfig, getPlatformName as getPlatformNameFromConfig } from './platforms'

export function getPlatformColor(platform: string) {
  return getPlatformColorFromConfig(platform)
}

export function getPlatformName(platform: string) {
  return getPlatformNameFromConfig(platform)
}
