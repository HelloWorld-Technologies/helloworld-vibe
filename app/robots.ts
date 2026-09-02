import type { MetadataRoute } from "next";

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_URL || "https://thehelloworld.com").replace(
    /\/$/,
    "",
  );
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
        // disallow: [
        //   "/api/",
        //   "/campaign/thankyou",
        //   "/diwali25/thankyou",
        //   "/student-hostel-in-kota/thankyou",
        //   "/kota-meridian-height/success",
        //   "/feedback-done",
        //   "/feedback-thankyou",
        //   "/business-insights",
        //   "/components",
        //   "/new",
        // ],
      },
      // { userAgent: "GPTBot", allow: "/" },
      // { userAgent: "ChatGPT-User", allow: "/" },
      // { userAgent: "Google-Extended", allow: "/" },
      // { userAgent: "PerplexityBot", allow: "/" },
      // { userAgent: "Claude-Web", allow: "/" },
      // { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
