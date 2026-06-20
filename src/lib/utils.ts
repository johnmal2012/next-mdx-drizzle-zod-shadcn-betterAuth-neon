import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ") // all wrhitespace to single space
    .replace(/[^a-zA-Z0-9\s'-]/g, "") // only allow letters, spaces, apostrophes and hyphens e.g. bob!45tom -> bobtom
    .replace(/\b\w/g, (char) => char.toUpperCase()); // \b = Word boundary; does not match a character; It matches a position; Specifically, a position between word character and non-word character; \w = matches a single word character ([A-Za-z0-9_]) e.g. b o b t o m; bob tom -> Bob Tom
}

// export const VALID_DOMAINS = () => {
export function getValidDomains() {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com");
  }

  return domains;
};