import type { Metadata } from "next";
import { NoResultsErrorPage } from "@/components/marketing/error-state-interactive-pages";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { getErrorState } from "@/src/tokens/error-states";

const config = getErrorState("no-results");

export const metadata: Metadata = staticPageMetadata({
  title: `${config.title} | HelloWorld`,
  description: config.description,
});

export default function NoResultsPage() {
  return <NoResultsErrorPage />;
}
