import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import {
  getAllBlogPostsMeta,
  getBlogPostBySlug,
} from "@/src/lib/blog.server";
import { getPublicSiteUrl } from "@/src/lib/schema";
import { pageShell } from "@/src/tokens/layout";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogPostsMeta()
    .filter((post) => !post.noindex)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog | HelloWorld" };

  const baseUrl = getPublicSiteUrl();
  const canonical =
    post.canonicalUrl || `${baseUrl}${post.urlPath}`;
  const ogImage = post.image?.startsWith("http")
    ? post.image
    : post.image
      ? `${baseUrl}${post.image.startsWith("/") ? "" : "/"}${post.image}`
      : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    robots: post.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const all = getAllBlogPostsMeta();
  const currentTags = new Set((post.tags || []).map((t) => t.toLowerCase()));
  const relatedByTag = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.tags || []).reduce(
        (acc, t) => acc + (currentTags.has(String(t).toLowerCase()) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ p }) => p);
  const related =
    relatedByTag.length >= 4
      ? relatedByTag
      : [
          ...relatedByTag,
          ...all
            .filter(
              (p) =>
                p.slug !== post.slug &&
                !relatedByTag.some((r) => r.slug === p.slug),
            )
            .slice(0, Math.max(0, 4 - relatedByTag.length)),
        ];

  const bannerImage = post.banner || post.thumbnail;

  return (
    <div className={pageShell.blogArticle}>
      <div className="mb-6">
        <Link href="/blogs" className="text-sm text-gray-600 hover:underline">
          ← Back to blogs
        </Link>
      </div>

      <header className="mb-8">
        {bannerImage ? (
          <div className="mb-6 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={bannerImage}
              alt={post.title}
              width={1600}
              height={900}
              className="h-56 w-full object-cover sm:h-72"
              priority
            />
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight">
          {post.header || post.title}
        </h1>
        <p className="mt-3 text-sm text-gray-700">{post.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>{post.readTimeMinutes} min read</span>
          {post.updated ? (
            <>
              <span>•</span>
              <span>Updated {post.updated}</span>
            </>
          ) : null}
        </div>
      </header>

      <div className="blog-article">
        <BlogArticle source={post.body} />
      </div>

      {post.faqs?.length ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">FAQs</h2>
          <div className="mt-4 space-y-3">
            {post.faqs.map((faq, idx) => (
              <details
                key={`${idx}-${faq.question}`}
                open
                className="rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <summary className="cursor-pointer select-none text-sm font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <div className="mt-2 text-sm text-gray-700">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Similar blogs</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <BlogPostCard
                key={p.slug}
                post={p}
                imageHeightClassName="h-32"
                className="rounded-lg"
              />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
