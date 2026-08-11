"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SidebarLoginFlow } from "@/components/auth/sidebar-login-flow";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BookingOccupantEditModal } from "@/components/booking/booking-occupant-edit-modal";
import { BookingPaymentPanel } from "@/components/booking/booking-payment-panel";
import { BookingSelectionModal } from "@/components/booking/booking-selection-modal";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getDefaultMoveInDateBounds,
  MoveInDatePickerModal,
} from "@/components/ui/move-in-date-picker";
import {
  filterCategoriesByOccupancy,
  getAvailableOccupancies,
  getRentForOccupancy,
} from "@/src/lib/hdp/category-occupancy";
import {
  resolveHdpPage,
  type HdpPageConfig,
} from "@/src/lib/hdp/resolve-hdp-page";
import {
  buildBookingHref,
  parseBookingOccupantInfo,
  type BookingOccupantInfo,
  type BookingSelectionDetails,
} from "@/src/lib/booking/url";
import { getStoredMobile, isLoggedIn } from "@/src/lib/auth-storage";
import {
  getBreadcrumbSchema,
  getPublicSiteUrl,
  getWebPageSchema,
  type HdpPageSchema,
} from "@/src/lib/schema";
import type { SelectedCategory, SharingType } from "@/src/models/booking";
import type { HdpOccupancy } from "@/src/tokens/hdp";
import { pageLayout } from "@/src/tokens/layout";
import { cn } from "@/src/lib/cn";

function sharingTypeFromOccupancy(occupancy: HdpOccupancy): SharingType {
  return occupancy === "private" ? "private" : "sharing";
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultMoveInDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return toDateInputValue(date);
}

function isHdpOccupancy(value: string | null): value is HdpOccupancy {
  return (
    value === "private" ||
    value === "double" ||
    value === "triple" ||
    value === "quadruple"
  );
}

function BookingLoginGate({
  onSuccess,
}: {
  onSuccess: (phone: string) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <SidebarLoginFlow onSuccess={onSuccess} reloadOnSuccess={false} />
      </div>
    </div>
  );
}

function BookingShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-white">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

function BookingLoadingState() {
  return (
    <BookingShell>
      <main className={cn(pageLayout.containerWithTopPadding, "pb-12 md:pb-16")}>
        <div className="mx-auto max-w-md animate-pulse space-y-4">
          <div className="h-8 rounded bg-gray-200" />
          <div className="h-40 rounded-3xl bg-gray-100" />
          <div className="h-64 rounded-3xl bg-gray-100" />
        </div>
      </main>
    </BookingShell>
  );
}

export function BookingPageContent({
  srpSlug: srpSlugProp,
  localitySlug: localitySlugProp,
  hdpSlug: hdpSlugProp,
}: {
  srpSlug?: string;
  localitySlug?: string;
  hdpSlug?: string;
}) {
  const router = useRouter();
  const routeParams = useParams<{
    srp_slug: string;
    locality: string;
    hdp_slug: string;
  }>();
  const searchParams = useSearchParams();

  const srpSlug = srpSlugProp || routeParams.srp_slug || "";
  const localitySlug = localitySlugProp || routeParams.locality || "";
  const hdpSlug = hdpSlugProp || routeParams.hdp_slug || "";

  const [config, setConfig] = useState<HdpPageConfig | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editMoveInOpen, setEditMoveInOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const moveInBounds = getDefaultMoveInDateBounds();

  const queryOccupantInfo = useMemo(
    () =>
      parseBookingOccupantInfo({
        firstName: searchParams.get("firstName") ?? undefined,
        lastName: searchParams.get("lastName") ?? undefined,
        email: searchParams.get("email") ?? undefined,
        gender: searchParams.get("gender") ?? undefined,
        phone: searchParams.get("phone") ?? undefined,
      }),
    [searchParams],
  );

  const queryMoveInDate =
    searchParams.get("moveInDate")?.trim() || defaultMoveInDate();
  const queryCategoryId = Number.parseInt(
    searchParams.get("categoryId") ?? "",
    10,
  );
  const queryOccupancy = searchParams.get("occupancy");

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      setLoadState("loading");
      const fresh = await resolveHdpPage(srpSlug, localitySlug, hdpSlug);
      if (cancelled) return;

      if (!fresh) {
        setConfig(null);
        setLoadState("error");
        return;
      }

      setConfig(fresh);
      setLoadState("ready");
    }

    if (!srpSlug || !localitySlug || !hdpSlug) {
      setLoadState("error");
      return;
    }

    void loadBooking();
    return () => {
      cancelled = true;
    };
  }, [srpSlug, localitySlug, hdpSlug]);

  const visibleCategories = useMemo(
    () =>
      (config?.categories ?? []).filter(
        (category) => category.show_to_ui && !category.is_removed,
      ),
    [config?.categories],
  );

  const availableOccupancies = useMemo(
    () => getAvailableOccupancies(visibleCategories),
    [visibleCategories],
  );

  const occupancy: HdpOccupancy = isHdpOccupancy(queryOccupancy)
    ? queryOccupancy
    : availableOccupancies[0] ?? "private";

  const occupancyCategories = useMemo(
    () => filterCategoriesByOccupancy(visibleCategories, occupancy),
    [visibleCategories, occupancy],
  );

  const categoryId =
    occupancyCategories.find((category) => category.id === queryCategoryId)
      ?.id ?? occupancyCategories[0]?.id;

  const moveInDate = queryMoveInDate;
  const occupantInfo = queryOccupantInfo;
  const hdpPath = config ? `/${config.canonicalPath}` : `/${srpSlug}/${localitySlug}/${hdpSlug}`;
  const bookingPath = config
    ? `/${config.canonicalPath}/booking`
    : `/${srpSlug}/${localitySlug}/${hdpSlug}/booking`;

  const schema: HdpPageSchema | null = useMemo(() => {
    if (!config) return null;
    const baseUrl = getPublicSiteUrl();
    const bookingCanonical = `${config.canonicalPath}/booking`;
    return {
      webPage: getWebPageSchema({
        baseUrl,
        path: bookingCanonical,
        name: `Booking | ${config.view.displayName}`,
        description: `Complete your booking at ${config.view.displayName}.`,
      }),
      breadcrumb: getBreadcrumbSchema(baseUrl, [
        { name: "Home", path: "" },
        ...config.breadcrumbItems
          .filter((item) => item.path)
          .map((item) => ({ name: item.name, path: item.path! })),
        { name: "Booking", path: bookingCanonical },
      ]),
    };
  }, [config]);

  function bookingHref(params: {
    categoryId?: string | number;
    occupancy?: HdpOccupancy;
    moveInDate?: string;
    occupant?: BookingOccupantInfo;
  }) {
    return buildBookingHref(bookingPath, {
      categoryId: params.categoryId ?? categoryId ?? "",
      occupancy: params.occupancy ?? occupancy,
      moveInDate: params.moveInDate ?? moveInDate,
      ...(params.occupant ?? occupantInfo),
    });
  }

  useEffect(() => {
    const logged = isLoggedIn();
    setLoggedIn(logged);
    setCheckedAuth(true);

    if (!logged || !categoryId) return;

    const storedMobile = (getStoredMobile() ?? "").replace(/\D/g, "");
    const urlPhone = occupantInfo.phone.replace(/\D/g, "");
    if (storedMobile.length === 10 && storedMobile !== urlPhone) {
      router.replace(
        bookingHref({ occupant: { ...occupantInfo, phone: storedMobile } }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on auth/phone mismatch only
  }, [occupantInfo.phone, router, categoryId, loadState]);

  function handleLoginSuccess(phone: string) {
    const loggedInPhone = phone.replace(/\D/g, "");
    window.location.assign(
      bookingHref({ occupant: { ...occupantInfo, phone: loggedInPhone } }),
    );
  }

  function handleSelectionSave(details: BookingSelectionDetails) {
    router.push(
      bookingHref({
        categoryId: details.categoryId,
        occupancy: details.occupancy,
      }),
    );
  }

  function handleOccupantSave(
    details: BookingOccupantInfo & { moveInDate: string },
  ) {
    router.push(
      bookingHref({
        moveInDate: details.moveInDate,
        occupant: {
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          gender: details.gender,
          phone: details.phone,
        },
      }),
    );
  }

  function handleMoveInSave(nextMoveInDate: string) {
    router.push(bookingHref({ moveInDate: nextMoveInDate }));
  }

  if (loadState === "loading") {
    return <BookingLoadingState />;
  }

  if (loadState === "error" || !config) {
    return (
      <BookingShell>
        <main
          className={cn(pageLayout.containerWithTopPadding, "py-16 text-center")}
        >
          <p className="text-base text-gray-600">
            Could not load this booking right now.{" "}
            <a
              href={hdpPath}
              className="font-medium text-hello-lime-700 hover:underline"
            >
              Go back to the property page
            </a>{" "}
            and try again.
          </p>
        </main>
      </BookingShell>
    );
  }

  const property = config.property;
  const category = occupancyCategories.find((item) => item.id === categoryId);

  if (!category || !categoryId) {
    return (
      <BookingShell>
        <main
          className={cn(pageLayout.containerWithTopPadding, "py-16 text-center")}
        >
          <p className="text-base text-gray-600">
            Selected room type is no longer available.{" "}
            <a
              href={hdpPath}
              className="font-medium text-hello-lime-700 hover:underline"
            >
              Go back to the property page
            </a>
            .
          </p>
        </main>
      </BookingShell>
    );
  }

  if (!checkedAuth) {
    return <BookingLoadingState />;
  }

  if (!loggedIn) {
    return (
      <BookingShell>
        <main
          className={cn(pageLayout.containerWithTopPadding, "pb-12 md:pb-16")}
        >
          <div className="mx-auto max-w-xl space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Login to continue booking
            </h1>
            <p className="text-base text-gray-600">
              Verify your mobile number to complete payment for{" "}
              {property.display_name || property.name}.
            </p>
          </div>

          <div className="mt-8 md:mt-10">
            <BookingLoginGate onSuccess={handleLoginSuccess} />
          </div>
        </main>
      </BookingShell>
    );
  }

  const selectedCategory: SelectedCategory = {
    ...category,
    type: sharingTypeFromOccupancy(occupancy),
  };
  const monthlyRent = getRentForOccupancy(category, occupancy);

  return (
    <div className="bg-white">
      {schema ? <JsonLd schema={schema} /> : null}
      <SiteHeader />

      <main className={cn(pageLayout.containerWithTopPadding, "pb-12 md:pb-16")}>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="order-2 min-w-0 md:order-1 md:max-w-[62%]">
            <BookingPaymentPanel
              property={property}
              category={selectedCategory}
              moveInDate={moveInDate}
              sharingType={selectedCategory.type}
              propertyPath={hdpPath}
              occupantInfo={occupantInfo}
            />
          </div>

          <div className="order-1 md:order-2 md:w-[32%] md:shrink-0">
            <div className="md:sticky md:top-24">
              <BookingSummaryCard
                property={property}
                category={selectedCategory}
                occupancy={occupancy}
                monthlyRent={monthlyRent}
                moveInDate={moveInDate}
                occupantInfo={occupantInfo}
                onEditRoom={() => setEditRoomOpen(true)}
                onEditDetails={() => setEditDetailsOpen(true)}
                onEditMoveIn={() => setEditMoveInOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      <BookingSelectionModal
        open={editRoomOpen}
        onClose={() => setEditRoomOpen(false)}
        categories={visibleCategories}
        minStayMonths={property.lockin_period}
        soldOut={property.sold_out}
        initialCategoryId={categoryId}
        initialOccupancy={occupancy}
        onSave={handleSelectionSave}
      />

      <BookingOccupantEditModal
        open={editDetailsOpen}
        onClose={() => setEditDetailsOpen(false)}
        initialValues={{ ...occupantInfo, moveInDate }}
        onSave={handleOccupantSave}
      />

      <MoveInDatePickerModal
        open={editMoveInOpen}
        onClose={() => setEditMoveInOpen(false)}
        value={moveInDate}
        min={moveInBounds.min}
        max={moveInBounds.max}
        onSelect={handleMoveInSave}
      />

      <SiteFooter />
    </div>
  );
}
