import type { Metadata } from "next";
import { ErrorStatePage } from "@/components/marketing/error-state-page";
import { staticPageMetadata } from "@/src/lib/og-metadata";
import { getErrorState } from "@/src/tokens/error-states";

const config = getErrorState("not-found");

export const metadata: Metadata = staticPageMetadata({
  title: `${config.title} | HelloWorld`,
  description: config.description,
});

export default function NotFound() {
  return <ErrorStatePage config={config} />;
}
