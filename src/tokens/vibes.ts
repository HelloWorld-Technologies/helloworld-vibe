export type VibeChip = {
  id: string;
  label: string;
  emoji: string;
  /** Numeric id from GET /vibes/list — sent as filter.vibes on SRP APIs. */
  apiId?: number;
};

export const vibeChips = [
  { id: "night-owl", label: "Night Owl", emoji: "🌙", apiId: 1 },
  { id: "foodie", label: "Foodie", emoji: "🍔", apiId: 2 },
  { id: "traveller", label: "Traveller", emoji: "✈️", apiId: 3 },
  { id: "party", label: "Party", emoji: "🎉", apiId: 4 },
  { id: "entrepreneur", label: "Entrepreneur", emoji: "💼", apiId: 5 },
  { id: "coder", label: "Coder", emoji: "💻", apiId: 6 },
  { id: "gamer", label: "Gamer", emoji: "🎮", apiId: 7 },
  { id: "music", label: "Music", emoji: "🎵", apiId: 8 },
  { id: "fitness-freak", label: "Fitness Freak", emoji: "💪", apiId: 9 },
  { id: "cricket", label: "Cricket", emoji: "🏏", apiId: 10 },
  { id: "football", label: "Football", emoji: "⚽️", apiId: 11 },
  { id: "badminton", label: "Badminton", emoji: "🏸", apiId: 12 },
  { id: "runner", label: "Runner", emoji: "🏃", apiId: 13 },
  { id: "board-games", label: "Board Games", emoji: "🎲", apiId: 14 },
  { id: "card-games", label: "Card Games", emoji: "🃏", apiId: 15 },
  { id: "content-creator", label: "Content Creator", emoji: "🎥", apiId: 16 },
  { id: "book-lover", label: "Book Lover", emoji: "📚", apiId: 17 },
  { id: "movie-lover", label: "Movie Lover", emoji: "🎬", apiId: 18 },
] as const satisfies readonly VibeChip[];
