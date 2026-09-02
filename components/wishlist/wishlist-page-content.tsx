"use client";

import { useCallback, useEffect, useState } from "react";
import { SidebarLoginFlow } from "@/components/auth/sidebar-login-flow";
import { PropertyActionsProvider } from "@/components/booking/property-actions-provider";
import { ErrorState } from "@/components/marketing/error-state";
import { WishlistSrpCard } from "@/components/marketing/wishlist-srp-card";
import { useOptionalWishlist } from "@/components/wishlist/wishlist-provider";
import { fetchWishlistPropertyCards } from "@/src/apis/wishlist";
import { isLoggedIn } from "@/src/lib/auth-storage";
import { mapWishlistCardToSrpCard } from "@/src/lib/map-property";
import { cn } from "@/src/lib/cn";
import { pageLayout } from "@/src/tokens/layout";
import { getErrorState } from "@/src/tokens/error-states";
import type { LocalityProperty } from "@/src/tokens/locality";

const emptyWishlistConfig = getErrorState("empty-wishlist");

function WishlistCardSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
    >
      <div className="aspect-4/3 bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="h-8 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function WishlistLoginGate({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <SidebarLoginFlow onSuccess={onSuccess} />
      </div>
    </div>
  );
}

export function WishlistPageContent() {
  const wishlist = useOptionalWishlist();
  const [loggedIn, setLoggedIn] = useState(false);
  const [properties, setProperties] = useState<LocalityProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    const cards = await fetchWishlistPropertyCards();
    setProperties(cards.map(mapWishlistCardToSrpCard));
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setCheckedAuth(true);
  }, []);

  const wishlistRevision = wishlist?.revision ?? 0;
  const refreshWishlist = wishlist?.refreshWishlist;

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      setProperties([]);
      return;
    }

    void loadWishlist();
  }, [loadWishlist, loggedIn, wishlistRevision]);

  useEffect(() => {
    if (loggedIn && refreshWishlist) {
      void refreshWishlist();
    }
  }, [loggedIn, refreshWishlist]);

  function handleLoginSuccess() {
    setLoggedIn(true);
    void refreshWishlist?.();
  }

  if (!checkedAuth) {
    return (
      <div className={cn(pageLayout.container, "py-10 md:py-14")}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <WishlistCardSkeleton key={`auth-loading-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className={cn(pageLayout.container, "py-10 md:py-14")}>
        <div className="mx-auto max-w-xl space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            My Wishlist
          </h1>
          <p className="text-base text-gray-600">
            Log in to view and manage your saved properties.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <WishlistLoginGate onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <PropertyActionsProvider>
      <div className={cn(pageLayout.container, "py-10 md:py-14")}>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <WishlistCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex justify-center">
            <ErrorState
              id={emptyWishlistConfig.id}
              title={emptyWishlistConfig.title}
              description={emptyWishlistConfig.description}
              image={emptyWishlistConfig.image}
              imageWidth={emptyWishlistConfig.imageWidth}
              imageHeight={emptyWishlistConfig.imageHeight}
              actions={emptyWishlistConfig.actions}
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                My Wishlist
              </h1>
              <p className="text-base text-gray-600">
                {properties.length} saved{" "}
                {properties.length === 1 ? "property" : "properties"}
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <WishlistSrpCard
                  key={property.id}
                  propertyId={property.propertyId}
                  href={property.href}
                  name={property.name}
                  subtitle={property.subtitle}
                  images={property.images}
                  rating={property.rating}
                  roomTypes={property.roomTypes}
                  rent={property.rent}
                  originalRent={property.originalRent}
                  offerLabel={property.offerLabel}
                  statusLabel={property.statusLabel}
                  visitsToday={property.visitsToday}
                  genderLabel={property.genderLabel}
                  vibeMatchScore={property.vibeMatchScore}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PropertyActionsProvider>
  );
}
