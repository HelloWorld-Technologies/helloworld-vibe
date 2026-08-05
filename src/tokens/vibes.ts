export type VibeChip = {
  id: string;
  label: string;
  emoji: string;
};

export const vibeChips = [
  { id: "night-owl", label: "Night Owl", emoji: "🌙" },
  { id: "foodie", label: "Foodie", emoji: "🍔" },
  { id: "traveller", label: "Traveller", emoji: "✈️" },
  { id: "party", label: "Party", emoji: "🎉" },
  { id: "entrepreneur", label: "Entrepreneur", emoji: "💼" },
  { id: "coder", label: "Coder", emoji: "💻" },
  { id: "gamer", label: "Gamer", emoji: "🎮" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "fitness-freak", label: "Fitness Freak", emoji: "💪" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽️" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "runner", label: "Runner", emoji: "🏃" },
  { id: "board-games", label: "Board Games", emoji: "🎲" },
  { id: "card-games", label: "Card Games", emoji: "🃏" },
  { id: "content-creator", label: "Content Creator", emoji: "🎥" },
  { id: "book-lover", label: "Book Lover", emoji: "📚" },
  { id: "movie-lover", label: "Movie Lover", emoji: "🎬" },
] as const satisfies readonly VibeChip[];
