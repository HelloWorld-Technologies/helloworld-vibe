import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WishlistPageContent } from "@/components/wishlist/wishlist-page-content";
import { staticPageMetadata } from "@/src/lib/og-metadata";

export const metadata: Metadata = staticPageMetadata({
  title: "My Wishlist | HelloWorld",
  description: "View and manage your saved coliving properties.",
  url: "/wishlist",
});

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <WishlistPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
