import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes conditionally and safely.
 * Example: cn("p-4", isHovered && "bg-blue-500", customClass)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
