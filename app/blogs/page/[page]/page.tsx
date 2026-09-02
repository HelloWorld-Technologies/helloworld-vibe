import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { buildOpenGraph, buildTwitter } from "@/src/lib/og-metadata";
import { getAllBlogPostsMeta } from "@/src/lib/blog.server";
import { BLOG_PAGE_SIZE, paginate } from "@/src/lib/pagination";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { pageShell } from "@/src/tokens/layout";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ page: string }>;
};

export async function generateStaticParams() {
  const allPosts = getAllBlogPostsMeta();
  const remaining = allPosts.slice(1);
  const { pageCount } = paginate(remaining, 1, BLOG_PAGE_SIZE);
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = Number(page);
  const baseUrl = getPublicSiteUrl();
  const title = `Blogs — Page ${pageNum} | HelloWorld`;
  const description =
    "Guides and updates on coliving, student housing, and living better with HelloWorld.";
  const canonical = `${baseUrl}/blogs/page/${pageNum}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: buildOpenGraph({ title, description, url: canonical }),
    twitter: buildTwitter({ title, description }),
  };
}

export default async function BlogsPaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isFinite(pageNum) || pageNum < 2) notFound();

  const allPosts = getAllBlogPostsMeta();
  const remaining = allPosts.slice(1);
  const { pageItems, pageCount } = paginate(remaining, pageNum, BLOG_PAGE_SIZE);
  if (pageNum > pageCount) notFound();

  return (
    <div className={pageShell.blogIndex}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Blogs — Page {pageNum}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Page {pageNum} of {pageCount}
          </p>
        </div>
        <Link href="/blogs" className="text-sm font-medium text-hello-lime-700 hover:underline">
          ← Back to blogs
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </ul>

      {pageCount > 1 ? (
        <nav className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/blogs" : `/blogs/page/${p}`}
              className={`rounded-full px-3 py-1 text-sm ${
                p === pageNum
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
