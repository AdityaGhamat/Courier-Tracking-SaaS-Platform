// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ShipmentStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; bg: string; text: string }
> = {
  label_created: {
    label: "Label Created",
    bg: "bg-surface-high",
    text: "text-on-surface-variant",
  },
  picked_up: {
    label: "Picked Up",
    bg: "bg-secondary/10",
    text: "text-secondary",
  },
  at_sorting_facility: {
    label: "At Sorting Facility",
    bg: "bg-warning-container",
    text: "text-warning-on-container",
  },
  in_transit: {
    label: "In Transit",
    bg: "bg-tertiary-container",
    text: "text-tertiary-on-container",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bg: "bg-secondary/15",
    text: "text-secondary",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-success-container",
    text: "text-success-on-container",
  },
  failed: {
    label: "Failed",
    bg: "bg-error-container",
    text: "text-error-on-container",
  },
  retry: {
    label: "Retry",
    bg: "bg-warning-container",
    text: "text-warning-on-container",
  },
  returned: {
    label: "Returned",
    bg: "bg-surface-high",
    text: "text-on-surface-variant",
  },
};
