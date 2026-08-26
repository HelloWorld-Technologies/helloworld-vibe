export type HomepageReview = {
  quote: string;
  name: string;
  city: string;
  backgroundColor: string;
  rotation: number;
  /** When set, card shows a Reddit icon linking to the source post/comment. */
  redditUrl?: string;
};

const REVIEW_BACKGROUNDS = [
  "#fee1e1",
  "#e6e0ff",
  "#d7f8ee",
  "#d6e5ff",
  "#ffe2b9",
  "#d4f5f0",
] as const;

const REVIEW_ROTATIONS = [-2, 3, -3, 2, -1, 4, -2, 3, -3, 2, -1, 4, -2] as const;

function withCardStyle(
  index: number,
  review: Omit<HomepageReview, "backgroundColor" | "rotation">,
): HomepageReview {
  return {
    ...review,
    backgroundColor: REVIEW_BACKGROUNDS[index % REVIEW_BACKGROUNDS.length],
    rotation: REVIEW_ROTATIONS[index % REVIEW_ROTATIONS.length],
  };
}

/**
 * Homepage Reddit testimonials. Near-identical cross-posted quotes are
 * deduped in favor of entries with complete short links.
 * Excludes thegreatpooplord (prospect asking questions, not a resident review).
 */
export const homepageReviews: HomepageReview[] = [
  withCardStyle(0, {
    quote:
      "Haven't tried a flat yet. Been staying at HelloWorld though. Got a cooking space, which is honestly all I needed. People are pretty chill here, and there are always some events happening. Never really felt bored that much tbh.",
    name: "Far_Language_7705",
    city: "Bangalore",
    redditUrl: "https://reddit.com/r/bangalorerentals/s/iNn6A5XXB7",
  }),
  withCardStyle(1, {
    quote:
      "For me the biggest issue was finding ppl with the same interests. I love playing football, but finding enough people consistently for a game is harder than it sounds. Recently found a good group through my PG community (HelloWorld) and now we have a game almost every Friday. Nothing fancy, just good fun and good company. If anyone's into football and looking for a game, feel free to join sometime.",
    name: "PRABHAT_CHOUBEY",
    city: "Bangalore",
    redditUrl: "https://reddit.com/r/BangaloreSocial/s/oRdGvXK0ij",
  }),
  withCardStyle(2, {
    quote:
      "Honestly, I've been staying here for a few months now, and overall it's been a pretty good experience. Of course, no place is perfect, but I like that I can do my own thing. Having a kitchen is a game changer for me since I prefer cooking sometimes, and I haven't faced any unnecessary restrictions.",
    name: "FragrantSit7B43",
    city: "Bangalore",
    redditUrl: "https://reddit.com/r/BangaloreSocial/s/qINx1HJh3K",
  }),
  withCardStyle(3, {
    quote:
      "Location-wise, this has been one of the better coliving spaces I've seen in Gurgaon. The property is well maintained, the interiors are nice and overall vibe feels peaceful. I also like that management doesn't impose random restrictions, so it feels more like living independently than staying in a typical PG.",
    name: "o8li",
    city: "Gurgaon",
    redditUrl: "https://reddit.com/r/BangaloreSocial/s/UufPCNYOnn",
  }),
  withCardStyle(4, {
    quote:
      "I actually stayed in another PG before moving to HelloWorld, and this has been a much better experience. The biggest difference for me is the community events. I've met people with similar interests, so it doesn't feel lonely after work. You can join in if you want, or just chill on your own.",
    name: "Sudden-Item5324",
    city: "Bangalore",
    // Truncated comment slug — parent thread URL
    redditUrl: "https://reddit.com/r/Bengaluru/comments/1tcrahu/",
  }),
  withCardStyle(5, {
    quote:
      "The chai thing is underrated. Started stepping out for evening chai with a couple of guys from my PG (HelloWorld) and that became the most consistent part of my week somehow. No planning, just chai.",
    name: "jdxm710",
    city: "Bangalore",
    redditUrl:
      "https://reddit.com/r/Bengaluru/comments/1tcrahu/comment/orlpd94/",
  }),
  withCardStyle(6, {
    quote:
      "I was actually at my PG (HelloWorld), everyone came out looking lost, someone pulled out cards, eight strangers played bluff till midnight, half of them are my closest friends now. Honestly having a solid group around you is a total game changer. Bangalore hits different after that.",
    name: "FragrantSit7B43",
    city: "Bangalore",
    // Truncated comment slug — parent thread URL
    redditUrl: "https://reddit.com/r/BangaloreSocial/comments/1u8319k/",
  }),
  withCardStyle(7, {
    quote:
      "The deposit thing is real. Took me 3 months to find a place that didn't ask for a massive upfront amount. What actually worked for me was moving into a managed PG (HelloWorld). Low deposit, no broker, no society aunty judging you. Wish I knew about it earlier.",
    name: "jdxm710",
    city: "Mumbai",
    redditUrl: "https://reddit.com/r/mumbai/s/UMoQj711OB",
  }),
  withCardStyle(8, {
    quote:
      "Honestly I got bored of pubs after a point. Every weekend started feeling the same. Met a few people through HelloWorld (where I'm staying rn) and now weekends are mostly football, badminton, TT, random outings and chill scenes. Nothing too fancy but it doesn't feel copy-paste anymore.",
    name: "Frost_lannister",
    city: "Gurgaon",
    // Truncated comment slug — parent thread URL
    redditUrl: "https://reddit.com/r/GurugramRentals/comments/1uzq1es/",
  }),
  withCardStyle(9, {
    quote:
      "Used to feel the same tbh. Meet a few people in HelloWorld (where I stay currently) and slowly became friends. Now whenever someone is free there's always something to do — board games, football, random walks, food runs or just sitting and talking nonsense. Def helped me get out of that work and scroll loop.",
    name: "LonelyPriority4408",
    city: "Hyderabad",
    // Truncated comment slug — parent thread URL
    redditUrl: "https://reddit.com/r/Hyderabad_city/comments/1vhu63n/",
  }),
  withCardStyle(10, {
    quote:
      "PG life honestly felt really congested for me, and adjusting there was quite difficult. I also looked for flats, but the deposits were way too high for decent locations. Right now, I'm staying in a coliving space (HelloWorld), and it's been pretty comfortable so far. Less responsibility, no unnecessary restrictions, and overall much more convenient. You can probably explore coliving options as well.",
    name: "rawr",
    city: "Hyderabad",
    // Truncated post slug — parent thread URL
    redditUrl: "https://reddit.com/r/Hyderabad_city/comments/1vhu63n/",
  }),
  withCardStyle(11, {
    quote:
      "PGs felt way too cramped for me, and the food situation was a struggle. Thought about getting a flat, but the deposits kind of freaked me out. Staying in a coliving space (HelloWorld) right now, having a cooking space itself solved half of my issues, and it's way less hassle overall. Coliving spaces are also a good option to consider.",
    name: "FragrantBit7843",
    city: "Gurgaon",
    redditUrl: "https://reddit.com/r/GurugramRentals/s/lr6emTFz5e",
  }),
  withCardStyle(12, {
    quote:
      "Shifted from Pune to Mumbai and the rent situation genuinely made me want to go back. Deposit alone was giving me anxiety. Got lucky though, my PG from Pune (HelloWorld) had options in Mumbai too. Didn't have to figure out everything from scratch, didn't break my bank either. Thank god for that honestly.",
    name: "jdxm710",
    city: "Mumbai",
    redditUrl: "https://reddit.com/r/mumbai/s/HDRV5QsLzP",
  }),
];
