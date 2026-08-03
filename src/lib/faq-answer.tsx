import type { ReactNode } from "react";
import Link from "next/link";

const KNOWN_PATH_LABELS: Record<string, string> = {
  "": "HelloWorld",
  "/": "HelloWorld",
  "/contact": "Contact Us",
  "/tenant-policy": "Tenant Policy",
  "/policy": "Privacy Policy",
  "/events": "Events",
  "/coworking": "Coworking",
  "/hello-world-living": "Hello World Living",
  "/refer": "Refer a Friend",
  "/safety": "Safety",
};

function humanizePathSegment(segment: string): string {
  return segment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function labelForHref(href: string): string {
  try {
    const isAbsolute = /^https?:\/\//i.test(href);
    const url = isAbsolute
      ? new URL(href)
      : new URL(href, "https://thehelloworld.com");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const normalized = path === "/" ? "/" : path;

    if (KNOWN_PATH_LABELS[normalized]) {
      return KNOWN_PATH_LABELS[normalized];
    }
    if (KNOWN_PATH_LABELS[path]) {
      return KNOWN_PATH_LABELS[path];
    }

    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "HelloWorld";
    return humanizePathSegment(segments[segments.length - 1]!);
  } catch {
    return href;
  }
}

function toInternalHref(raw: string): string | null {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (
      host === "thehelloworld.com" ||
      host === "localhost" ||
      host.endsWith(".thehelloworld.com")
    ) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
  } catch {
    return null;
  }
  return null;
}

function trimTrailingPunctuation(value: string): {
  core: string;
  trailing: string;
} {
  const match = value.match(/^(.*?)([.,;:!?)\]}'"]+)$/);
  if (!match) return { core: value, trailing: "" };
  return { core: match[1]!, trailing: match[2]! };
}

const TOKEN_PATTERN =
  /https?:\/\/[^\s<>"']+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b\d{3}\s\d{3}\s\d{2}\s\d{2}\b/gi;

export function renderFaqAnswer(answer: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(TOKEN_PATTERN.source, TOKEN_PATTERN.flags);

  while ((match = pattern.exec(answer)) !== null) {
    const raw = match[0];
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(answer.slice(lastIndex, start));
    }

    const { core, trailing } = trimTrailingPunctuation(raw);
    const key = `${start}-${core}`;

    if (/^https?:\/\//i.test(core)) {
      const internal = toInternalHref(core);
      const label = labelForHref(core);
      const className =
        "font-semibold text-blue-light-600 underline-offset-2 hover:underline";

      if (internal) {
        nodes.push(
          <Link key={key} href={internal} className={className}>
            {label}
          </Link>,
        );
      } else {
        nodes.push(
          <a
            key={key}
            href={core}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {label}
          </a>,
        );
      }
    } else if (core.includes("@")) {
      nodes.push(
        <a
          key={key}
          href={`mailto:${core}`}
          className="font-semibold text-blue-light-600 underline-offset-2 hover:underline"
        >
          {core}
        </a>,
      );
    } else {
      const digits = core.replace(/\s+/g, "");
      nodes.push(
        <a
          key={key}
          href={`tel:${digits}`}
          className="font-semibold text-blue-light-600 underline-offset-2 hover:underline"
        >
          {core}
        </a>,
      );
    }

    if (trailing) nodes.push(trailing);
    lastIndex = start + raw.length;
  }

  if (lastIndex < answer.length) {
    nodes.push(answer.slice(lastIndex));
  }

  return nodes;
}
