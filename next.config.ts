import type { NextConfig } from "next";

// HDP redirects (~1k+) and nested→flat marketing URL rules run in middleware (see helloworld-next/middleware.ts).
// next.config redirects() run *before* middleware, so broad nested→flat patterns must not appear here
// or they break legacy `…-pg-in-…` HDP URLs.

const cspBase = [
  "default-src 'self' https: data: blob:",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' https: 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' https: 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "font-src 'self' https: data:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https:",
  // "upgrade-insecure-requests",
].join("; ");

const cspReportOnly = [cspBase, "require-trusted-types-for 'script'"].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const imageRemotePatterns: NonNullable<
  NextConfig["images"]
>["remotePatterns"] = [
  { protocol: "https", hostname: "d1e75ovm69uz4t.cloudfront.net", port: "" },
  { protocol: "https", hostname: "thehelloworld.com", port: "" },
  { protocol: "https", hostname: "vercel.thehelloworld.com", port: "" },
  { protocol: "https", hostname: "d1br52syqi6xq3.cloudfront.net", port: "" },
  {
    protocol: "https",
    hostname: "hw-prod-static-assets.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hello-assets-items.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hw-production-compressed-image.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hw-staging-media.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "property-videos-original-staging.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "property-videos-original.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hw-production-original-image.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hw-prod-events.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  {
    protocol: "https",
    hostname: "hw-staging-events.s3.ap-south-1.amazonaws.com",
    port: "",
  },
  { protocol: "https", hostname: "images.thehelloworld.com" },
];

const nextConfig: NextConfig = {
  async redirects() {
    const blogRedirects = [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:path*", destination: "/blogs/:path*", permanent: true },
      {
        source:
          "/blogs/coliving-in-goa-how-india-s-favourite-holiday-destination-is-becoming-a-serious-",
        destination:
          "/blogs/coliving-in-goa-how-india-s-favourite-holiday-destination-is-becoming-a-serious-living-choice",
        permanent: true,
      },
    ];
    const slashRedirects = [
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
    const cityRedirects = [
      {
        source: "/coliving-in-kota",
        destination: "/hostels-in-kota",
        permanent: true,
      },
      {
        source: "/coliving-in-kota/:path*",
        destination: "/hostels-in-kota/:path*",
        permanent: true,
      },
    ];
    const kotaHostelRedirects = [
      {
        source: "/student-hostels-in-kota",
        destination: "/hostels-in-kota",
        permanent: true,
      },
      {
        source: "/student-hostels-in-kota/:path*",
        destination: "/hostels-in-kota/:path*",
        permanent: true,
      },
    ];
    const genderPgFlatRedirects = [
      {
        source: "/gents-pg-in-:city",
        destination: "/pg-for-boys-in-:city",
        permanent: true,
      },
      {
        source: "/ladies-pg-in-:city",
        destination: "/pg-for-girls-in-:city",
        permanent: true,
      },
      {
        source: "/pg-for-girls-in-harola-noida",
        destination: "/pg-for-girls-in-noida",
        permanent: true,
      },
      {
        source: "/pg-for-girls-in-kavesar-mumbai",
        destination: "/pg-for-girls-in-mumbai",
        permanent: true,
      },
      {
        source: "/pg-for-girls-in-sector-22-noida",
        destination: "/pg-for-girls-in-noida",
        permanent: true,
      },
    ];

    return [
      ...kotaHostelRedirects,
      ...blogRedirects,
      ...slashRedirects,
      ...cityRedirects,
      ...genderPgFlatRedirects,
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_ENV === "production",
  },
  reactStrictMode: false,
  images: {
    minimumCacheTTL: 86400,
    unoptimized: true,
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
