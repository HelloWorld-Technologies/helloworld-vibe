import type { Asset } from "@/src/tokens/assets";
import { getAssetById } from "@/src/tokens/assets";

export type ErrorStateId =
  | "not-found"
  | "server-error"
  | "no-results"
  | "offline"
  | "empty-wishlist"
  | "forbidden";

export type ErrorStateActionVariant = "primary" | "secondary";

export type ErrorStateAction = {
  label: string;
  href?: string;
  variant?: ErrorStateActionVariant;
};

export type ErrorStateConfig = {
  id: ErrorStateId;
  title: string;
  description: string;
  image: Asset;
  imageWidth: number;
  imageHeight: number;
  actions: ErrorStateAction[];
};

function requireAsset(id: string): Asset {
  const asset = getAssetById("error", id);
  if (!asset) {
    throw new Error(`Missing error asset: ${id}`);
  }
  return asset;
}

export const errorStates = {
  "not-found": {
    id: "not-found",
    title: "Uh-oh, We Lost the Scent!",
    description:
      "Looks like this page wandered off, got moved, or never existed in the first place. Don't worry, we'll help you get back on track.",
    image: requireAsset("404-1"),
    imageWidth: 320,
    imageHeight: 280,
    actions: [{ label: "Take Me Home", href: "/", variant: "primary" }],
  },
  "server-error": {
    id: "server-error",
    title: "We're Fixing Things Up!",
    description:
      "Our tail-wagging team is on it! We'll be back in no time. Thank you for your patience.",
    image: requireAsset("error-500-server-error"),
    imageWidth: 320,
    imageHeight: 280,
    actions: [
      { label: "Try Refreshing", variant: "secondary" },
      { label: "Back", href: "/", variant: "primary" },
    ],
  },
  "no-results": {
    id: "no-results",
    title: "No results found.",
    description:
      "Please check for spelling errors or try different keywords. Let's find your dream stay together!",
    image: requireAsset("empty-state-1"),
    imageWidth: 320,
    imageHeight: 280,
    actions: [
      { label: "Clear Filters", variant: "secondary" },
      { label: "Contact Us", href: "/contact", variant: "primary" },
    ],
  },
  offline: {
    id: "offline",
    title: "You're not connected to the internet.",
    description:
      "Check your wifi or data and try again. Our dog is sitting by the door, ready to go.",
    image: requireAsset("no-internet-1"),
    imageWidth: 320,
    imageHeight: 280,
    actions: [{ label: "Try Again", variant: "primary" }],
  },
  "empty-wishlist": {
    id: "empty-wishlist",
    title: "Your Wishlist looks Empty 👀",
    description:
      "Browse verified coliving spaces and save the ones that match your vibe.",
    image: requireAsset("empty-state-1"),
    imageWidth: 256,
    imageHeight: 224,
    actions: [{ label: "Explore Residencies", href: "/", variant: "primary" }],
  },
  forbidden: {
    id: "forbidden",
    title: "You don't have access to this page.",
    description:
      "This section is reserved for special guests. Please contact support if you believe this is a mistake.",
    image: requireAsset("403-2"),
    imageWidth: 320,
    imageHeight: 280,
    actions: [{ label: "Go Home", href: "/", variant: "primary" }],
  },
} satisfies Record<ErrorStateId, ErrorStateConfig>;

export function getErrorState(id: ErrorStateId): ErrorStateConfig {
  return errorStates[id];
}
