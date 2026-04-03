import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


/*
install this 2 with npm

1) clsx
→ Helps you conditionally join class names
2) tailwind-merge
→ Fixes conflicting Tailwind classes

*/ 