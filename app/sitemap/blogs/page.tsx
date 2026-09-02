import type { Metadata } from "next";
import { SitemapListPage } from "@/components/sitemap/sitemap-list-page";
import { sitemapPageMetadata } from "@/src/lib/og-metadata";
import {
  buildBlogLinks,
  buildGeneratedAt,
  getPublicBaseUrl,
} from "@/src/lib/sitemap-pages/data.server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicBaseUrl();
  return sitemapPageMetadata({
    title: "Sitemap: Blogs | HelloWorld",
    description: "All blog URLs on HelloWorld.",
    canonical: `${baseUrl}/sitemap/blogs`,
  });
}

export default async function BlogSitemapPage() {
  const baseUrl = getPublicBaseUrl();
  const { iso: generatedAtIso, text: generatedAtText } = buildGeneratedAt();
  const blogLinks = buildBlogLinks();

  return (
    <SitemapListPage
      baseUrl={baseUrl}
      canonicalPath="/sitemap/blogs"
      title="Sitemap: Blogs"
      description="All blog URLs on HelloWorld."
      generatedAtIso={generatedAtIso}
      generatedAtText={generatedAtText}
      sections={[
        {
          title: "Blog posts",
          items: blogLinks,
          rightLink: { href: "/sitemap", label: "Back to sitemap" },
        },
      ]}
    />
  );
}
