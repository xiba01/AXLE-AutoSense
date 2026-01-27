import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function toPascalCase(str) {
    if (!str) return "";
    return str.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase());
}
