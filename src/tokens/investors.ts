export const investorsPageCopy = {
  title: "Investors | HelloWorld",
  description:
    "Access HelloWorld's financial statements, audit reports, MGT-7 filings, and investor disclosures.",
  heroTitle: "Investors",
  heroSubtitle:
    "Access HelloWorld's financial statements, audit reports, MGT-7 filings, and investor disclosures.",
} as const;

export type InvestorsTabId =
  | "financial-statements"
  | "audit-report"
  | "mgt-7";

export const investorsTabs = [
  { id: "financial-statements" as const, label: "Financial Statements" },
  { id: "audit-report" as const, label: "Audit Report" },
  { id: "mgt-7" as const, label: "MGT-7" },
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
      id: "financial-statements-fy-2024-25",
      title: "Financial Statements FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/financial-statements-fy-2024-25.pdf",
    },
  ],
  "audit-report": [
    {
      id: "audit-report-fy-2024-25",
      title: "Audit Report FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/audit-report-fy-2024-25.pdf",
    },
  ],
  "mgt-7": [
    {
      id: "mgt-7-fy-2024-25",
      title: "MGT-7 FY 2024-25",
      financialYear: "FY 2024-25",
      href: "/assets/investors/mgt-7-fy-2024-25.pdf",
    },
  ],
};
