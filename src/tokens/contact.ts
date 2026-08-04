export const contactPageCopy = {
  title: "Contact Us",
  subtitle:
    "Have a question, need assistance or want to explore a partnership? Reach out to us and we'll help you with the next steps.",
} as const;

export const contactStackedLogo = "/assets/logos/hello-world-stacked.png";

export const contactMailing = {
  title: "Mailing address",
  company: "HelloWorld Technologies India Private Limited",
  address:
    "375, 5th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102.",
} as const;

export const contactQueries = {
  title: "For Queries",
  phone: "888 000 88 88",
  phoneHref: "tel:8880008888",
  label: "Help desk",
  hours: "Available from 11 AM to 8 PM",
} as const;

export const contactEmails = {
  title: "Reach out to us at",
  items: [
    {
      email: "sales@thehelloworld.com",
      href: "mailto:sales@thehelloworld.com",
      note: "For property and partnership enquiries",
    },
    {
      email: "care@thehelloworld.com",
      href: "mailto:care@thehelloworld.com",
      note: "For any issues, send an email",
    },
  ],
} as const;
