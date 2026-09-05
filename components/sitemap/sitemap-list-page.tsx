import Link from "next/link";
import type { ReactNode } from "react";
import type { SitemapSection } from "@/src/lib/sitemap-pages/data.server";
import { pageShell } from "@/src/tokens/layout";

export function SitemapListPage(props: {
  baseUrl: string;
  canonicalPath: string;
  title: string;
  description: string;
  generatedAtIso: string;
  generatedAtText: string;
  sections: SitemapSection[];
  headerRightLink?: { href: string; label: string };
  footerNote?: ReactNode;
}) {
  const {
    title,
    description,
    generatedAtIso,
    generatedAtText,
    sections,
    headerRightLink,
    footerNote,
  } = props;
  const total = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <main className={pageShell.sitemap}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <p className="mt-2 text-sm text-gray-600">
            {total.toLocaleString()} links across {sections.length} sections.
            Generated{" "}
            <time dateTime={generatedAtIso}>{generatedAtText}</time>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            XML index:{" "}
            <a className="text-hello-lime-700 underline" href="/sitemap.xml">
              /sitemap.xml
            </a>
          </p>
        </div>
        {headerRightLink ? (
          <Link
            className="shrink-0 pt-1 text-sm text-hello-lime-700 underline"
            href={headerRightLink.href}
          >
            {headerRightLink.label}
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-600">
                  {section.items.length.toLocaleString()} links
                </p>
              </div>
              {section.rightLink ? (
                <Link
                  className="text-sm text-hello-lime-700 underline"
                  href={section.rightLink.href}
                >
                  {section.rightLink.label}
                </Link>
              ) : null}
            </div>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {section.items.map((it) => {
                const isInternal = it.href.startsWith("/");
                if (isInternal) {
                  return (
                    <li key={`${section.title}:${it.href}`} className="min-w-0">
                      <Link
                        href={it.href}
                        prefetch={false}
                        className="block truncate rounded-lg px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:underline"
                        title={it.href}
                      >
                        {it.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={`${section.title}:${it.href}`} className="min-w-0">
                    <a
                      href={it.href}
                      className="block truncate rounded-lg px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:underline"
                      title={it.href}
                    >
                      {it.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {footerNote ? (
        <div className="mx-auto w-full pb-10 pt-6">{footerNote}</div>
      ) : null}
    </main>
  );
}
