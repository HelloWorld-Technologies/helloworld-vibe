export type HdpReviewCategory = {
  label: string;
  score: number;
};

export type HdpResidentReview = {
  id: string;
  name: string;
  quote: string;
};

export const hdpReviewSummary = {
  rating: 4.8,
  label: "Exceptional",
  reviewCount: 127,
  recommendPercent: 95,
  categories: [
    { label: "Cleanliness", score: 4.8 },
    { label: "Location", score: 4.7 },
    { label: "Amenities", score: 4.8 },
    { label: "Community", score: 4.6 },
  ] satisfies HdpReviewCategory[],
};

export const hdpResidentReviews: readonly HdpResidentReview[] = [
  {
    id: "review-1",
    name: "Jim Halpert",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Turpis vitae in ullamcorper tortor quis non. Porttitor leo eget semper adipiscing nam molestie. Enim et turpis nulla feugiat lorem. Tempor iaculis et nunc elementum neque dis lobortis.",
  },
  {
    id: "review-2",
    name: "Pam Beesly",
    quote:
      "The community events and common areas made settling in effortless. Staff were responsive, rooms were spotless, and the location worked perfectly for my commute to Electronic City.",
  },
  {
    id: "review-3",
    name: "Dwight Schrute",
    quote:
      "Clean rooms, reliable Wi‑Fi, and a well-managed property. The vibe match felt accurate and I met people with similar routines within the first week.",
  },
  {
    id: "review-4",
    name: "Angela Martin",
    quote:
      "Housekeeping and security were consistently good. Booking a visit was simple, and the room options were clearly explained before I moved in.",
  },
];
