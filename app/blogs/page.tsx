import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getAllBlogPostsMeta } from "@/src/lib/blog.server";
import { BLOG_PAGE_SIZE, paginate } from "@/src/lib/pagination";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { pageShell } from "@/src/tokens/layout";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getPublicSiteUrl();
  return {
    title: "Blogs | HelloWorld",
    description:
      "Guides and updates on coliving, student housing, and living better with HelloWorld.",
    alternates: { canonical: `${baseUrl}/blogs` },
  };
}

export default function BlogsIndexPage() {
  const allPosts = getAllBlogPostsMeta();
  const featured = allPosts[0] || null;
  const remaining = allPosts.slice(1);
  const { pageItems, pageCount } = paginate(remaining, 1, BLOG_PAGE_SIZE);
  const featuredImage = featured?.banner || featured?.thumbnail;

  return (
    <div className={pageShell.blogIndex}>
      {featured ? (
        <section className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-black">
          <Link href={featured.urlPath} className="group relative block">
            {featuredImage ? (
              <>
                <Image
                  src={featuredImage}
                  alt={featured.title}
                  width={1800}
                  height={900}
                  priority
                  className="h-[260px] w-full object-cover opacity-90 md:h-[520px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </>
            ) : (
              <div className="h-[260px] w-full bg-gray-200 md:h-[380px]" />
            )}

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <h1 className="max-w-2xl text-2xl font-semibold leading-tight text-white md:text-4xl">
                {featured.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                {featured.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                <time dateTime={featured.date}>{featured.date}</time>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span>{featured.readTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Blogs</h2>
        <p className="mt-1 text-sm text-gray-600">
          {allPosts.length.toLocaleString()} articles on coliving and student housing.
        </p>
      </div>

      {pageItems.length === 0 && !featured ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-700">No posts yet.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={page === 1 ? "/blogs" : `/blogs/page/${page}`}
              className={`rounded-full px-3 py-1 text-sm ${
                page === 1
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
