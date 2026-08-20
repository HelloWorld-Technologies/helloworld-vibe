"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import {
  UnderlineTabPanel,
  UnderlineTabs,
} from "@/components/ui/underline-tabs";
import { aboutAurumLogo } from "@/src/tokens/about";
import {
  investorDocumentsByTab,
  investorsPageCopy,
  investorsTabs,
  type InvestorDocument,
  type InvestorsTabId,
} from "@/src/tokens/investors";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M9 13h6M9 17h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M1.75 10S4.75 4.75 10 4.75 18.25 10 18.25 10 15.25 15.25 10 15.25 1.75 10 1.75 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 3.5v9M6.5 9.5 10 13l3.5-3.5M4 16.5h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentActions({ doc }: { doc: InvestorDocument }) {
  const filename = doc.href.split("/").pop() ?? "document.pdf";

  return (
    <div className="flex items-center gap-2">
      <a
        href={doc.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:flex-none sm:px-4"
      >
        <EyeIcon className="size-4 shrink-0" />
        View
      </a>
      <a
        href={doc.href}
        download={filename}
        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-hello-lime-400 px-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-hello-lime-500 sm:flex-none sm:px-4"
      >
        <DownloadIcon className="size-4 shrink-0" />
        Download
      </a>
    </div>
  );
}

function DocumentMobileCard({ doc }: { doc: InvestorDocument }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(16,24,40,0.06)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-hello-lime-50 text-hello-lime-700">
          <DocumentIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{doc.title}</h3>
          <p className="mt-0.5 text-sm text-gray-500">{doc.financialYear}</p>
        </div>
      </div>
      <div className="mt-4">
        <DocumentActions doc={doc} />
      </div>
    </article>
  );
}

function DocumentsPanel({
  tabId,
  documents,
}: {
  tabId: InvestorsTabId;
  documents: readonly InvestorDocument[];
}) {
  const tabLabel =
    investorsTabs.find((tab) => tab.id === tabId)?.label ?? "Documents";

  return (
    <div className="mt-6 md:mt-8">
      <h2 className="hidden text-lg font-bold text-gray-900 md:block">
        {tabLabel}
      </h2>

      <div className="mt-0 space-y-3 md:hidden">
        {documents.map((doc) => (
          <DocumentMobileCard key={doc.id} doc={doc} />
        ))}
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-gray-200 md:block">
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_auto] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600">
          <span>Document</span>
          <span>Financial Year</span>
          <span className="sr-only">Actions</span>
        </div>
        <ul>
          {documents.map((doc, index) => (
            <li
              key={doc.id}
              className={cn(
                "grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_auto] items-center gap-4 px-5 py-4",
                index < documents.length - 1 && "border-b border-gray-100",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-hello-lime-50 text-hello-lime-700">
                  <DocumentIcon className="size-5" />
                </span>
                <span className="truncate text-sm font-semibold text-gray-900">
                  {doc.title}
                </span>
              </div>
              <span className="text-sm text-gray-600">{doc.financialYear}</span>
              <DocumentActions doc={doc} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InvestorsHero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-blue-light-50 to-white"
      aria-label="Investors"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-10 lg:pr-20"
      >
        <p className="select-none whitespace-nowrap font-satoshi text-[4.5rem] font-bold leading-none tracking-tight text-white/70 sm:text-[7rem] lg:text-[9.5rem]">
          hello world
        </p>
      </div>

      <div className={cn(pageLayout.container, "relative z-10 py-10 md:py-14")}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-[3.5rem]">
          {investorsPageCopy.heroTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 md:text-lg md:leading-8">
          {investorsPageCopy.heroSubtitle}
        </p>
      </div>
    </section>
  );
}

function InvestorsAurum() {
  return (
    <section
      className="border-t border-gray-100 bg-white py-10 md:py-14"
      aria-label="Part of Aurum PropTech"
    >
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-gray-500">
          PART OF
        </p>
        <Link
          href="https://www.aurumproptech.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-3 h-10 w-[12rem] sm:h-12 sm:w-[16rem]"
        >
          <Image
            src={aboutAurumLogo}
            alt="Aurum PropTech"
            fill
            sizes="256px"
            className="object-contain"
          />
        </Link>
      </div>
    </section>
  );
}

export function InvestorsPageContent() {
  const tabsId = useId();
  const [activeTab, setActiveTab] =
    useState<InvestorsTabId>("financial-statements");
  const documents = investorDocumentsByTab[activeTab];

  return (
    <>
      <InvestorsHero />

      <section className="bg-white pb-12 md:pb-16">
        <div className={pageLayout.container}>
          <UnderlineTabs
            items={investorsTabs}
            value={activeTab}
            onChange={setActiveTab}
            layout="start"
            baseId={tabsId}
            aria-label="Investor documents"
          />

          {investorsTabs.map((tab) => (
            <UnderlineTabPanel
              key={tab.id}
              id={`${tabsId}-${tab.id}-panel`}
              labelledBy={`${tabsId}-${tab.id}`}
              active={activeTab === tab.id}
            >
              <DocumentsPanel
                tabId={tab.id}
                documents={
                  tab.id === activeTab
                    ? documents
                    : investorDocumentsByTab[tab.id]
                }
              />
            </UnderlineTabPanel>
          ))}
        </div>
      </section>

      <InvestorsAurum />
    </>
  );
}
