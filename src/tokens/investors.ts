export const investorsPageCopy = {
  title: "Investors | HelloWorld",
  description:
    "Access HelloWorld's financial statements, annual returns, and investor disclosures.",
  heroTitle: "Investors",
  heroSubtitle:
    "Access HelloWorld's financial statements, annual returns, and investor disclosures.",
} as const;

export type InvestorsTabId = "financial-statements" | "annual-return";

export const investorsTabs = [
  { id: "financial-statements" as const, label: "Financial Statements" },
  { id: "annual-return" as const, label: "Annual Return" },
] as const;

export interface InvestorDocument {
  id: string;
  title: string;
  financialYear: string;
  href: string;
}

export const investorDocumentsByTab: Record<
  InvestorsTabId,
  readonly InvestorDocument[]
> = {
  "financial-statements": [
    {
      id: "balance-sheet-fy-2024-25",
      title: "Balance Sheet FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/balance-sheet-fy-2024-25.pdf",
    },
    {
      id: "profit-loss-fy-2024-25",
      title: "Profit & Loss Statement FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/profit-loss-fy-2024-25.pdf",
    },
    {
      id: "cash-flow-fy-2024-25",
      title: "Cash Flow Statement FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/cash-flow-fy-2024-25.pdf",
    },
  ],
  "annual-return": [
    {
      id: "annual-return-fy-2024-25",
      title: "Annual Return FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/annual-return-fy-2024-25.pdf",
    },
    {
      id: "annual-return-fy-2023-24",
      title: "Annual Return FY 2023-24",
      financialYear: "FY 2023-24",
      href: "/assets/investors/annual-return-fy-2023-24.pdf",
    },
  ],
};
