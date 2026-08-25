const AMENITY_EMOJIS: Record<string, string> = {
  ac: "❄️",
  "air conditioner": "❄️",
  "ac ready": "❄️",
  cctv: "📹",
  security: "🔒",
  "attached bathroom": "🚿",
  "attached washroom": "🚿",
  "shared washroom": "🚿",
  balcony: "🌿",
  "balcony access": "🌿",
  "bar table": "🍸",
  "basic common kitchen": "🍳",
  "basic kitchen": "🍳",
  "bed type queen 5x6": "🛏️",
  "bio-metric": "🔐",
  "board games": "🎲",
  carom: "🎯",
  carrom: "🎯",
  "carrom board": "🎯",
  chess: "♟️",
  cleaning: "🧹",
  "cloths dry stand": "👕",
  "coffee table": "☕",
  "compact layout": "📐",
  cots: "🛏️",
  "common dining area": "🍽️",
  "covered parking": "🅿️",
  cupboard: "🗄️",
  wardrobe: "🗄️",
  "daily house cleaning": "🧹",
  "dart board": "🎯",
  dartboard: "🎯",
  "dining table & chair": "🍽️",
  "dinning table": "🍽️",
  dth: "📡",
  "dry stand": "👕",
  electricity: "💡",
  food: "🍽️",
  foosball: "⚽",
  fridge: "🧊",
  "fully equipped kitchenette": "🍳",
  gardening: "🌱",
  gas: "🔥",
  "gas connection": "🔥",
  "gas induction": "🔥",
  geyser: "🚿",
  gym: "💪",
  hammok: "🏖️",
  hammock: "🏖️",
  "house keeping": "🧹",
  housekeeping: "🧹",
  internet: "📶",
  kitchen: "🍳",
  kitchenette: "🍳",
  "king size mattress 5inch": "🛏️",
  "king size mattress 6inch": "🛏️",
  "king size mattress 8inch": "🛏️",
  laundry: "🧺",
  library: "📚",
  lift: "🛗",
  "mattress 5inch": "🛏️",
  "mattress 6inch": "🛏️",
  "mattress 8inch": "🛏️",
  "mattress queen 5inch": "🛏️",
  "mattress queen 6inch": "🛏️",
  "mattress queen 8inch": "🛏️",
  microwave: "🥘",
  "mini golf": "⛳",
  monopoly: "🎲",
  pillow: "🛏️",
  playstation: "🎮",
  "power backup": "⚡",
  "24/7 power backup": "⚡",
  ro: "🚰",
  "ro drinking water": "🚰",
  "rooftop garden": "🌱",
  "65' led tv": "📺",
  "shoe rack": "👟",
  "side table": "🪑",
  sofa: "🪑",
  "soft furnishing": "🛋️",
  "study table": "📚",
  "study table with chair": "📚",
  "work desk": "📚",
  "table tennis": "🏓",
  tv: "📺",
  "twin 3x6": "🛏️",
  "twin mattress 5inch": "🛏️",
  "twin mattress 6inch": "🛏️",
  "twin mattress 8inch": "🛏️",
  "un-covered parking": "🅿️",
  uno: "🃏",
  "washing machine": "🧺",
  water: "💧",
  "water cooler": "💧",
  wifi: "📶",
  "wi-fi": "📶",
};

const DEFAULT_AMENITY_EMOJI = "✨";
const LEADING_EMOJI_RE =
  /^(\p{Extended_Pictographic}[\p{Extended_Pictographic}\uFE0F\u200D]*)\s*/u;

function humanizeAmenityLabel(value: string): string {
  const trimmed = value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Preserve intentional casing from key features (e.g. "AC", "Attached bathroom").
  // Still title-case pure lowercase slugs like "wifi".
  const shouldTitleCase =
    value.includes("_") ||
    (trimmed === trimmed.toLowerCase() && /[a-z]/.test(trimmed));

  if (!shouldTitleCase) return trimmed;

  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeAmenityKey(name: string): string {
  return name
    .replace(LEADING_EMOJI_RE, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAmenityEmoji(amenityName: string): string {
  if (!amenityName) return DEFAULT_AMENITY_EMOJI;
  return AMENITY_EMOJIS[normalizeAmenityKey(amenityName)] ?? DEFAULT_AMENITY_EMOJI;
}

export function formatAmenityForDisplay(raw: string): {
  emoji: string;
  label: string;
} {
  const trimmed = raw.trim();
  const leadingEmoji = trimmed.match(LEADING_EMOJI_RE)?.[1];
  const name = leadingEmoji ? trimmed.slice(leadingEmoji.length).trim() : trimmed;
  const label = humanizeAmenityLabel(name);

  return {
    emoji: leadingEmoji ?? getAmenityEmoji(name || trimmed),
    label,
  };
}
