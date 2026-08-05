"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/src/lib/cn";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";

export type NearbyMapProperty = {
  name: string;
  addressLine?: string;
  locality?: string;
  imageSrc?: string;
  startingRent?: number;
  latitude?: number;
  longitude?: number;
};

function formatRentLabel(amount?: number) {
  if (!amount || amount <= 0) return "";
  return `₹${amount.toLocaleString("en-IN")}/mo*`;
}

type HdpNearbyMapModalProps = {
  open: boolean;
  onClose: () => void;
  property: NearbyMapProperty;
  categories: readonly NeighborhoodCardData[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

function createDivIcon(
  L: typeof import("leaflet"),
  color: "green" | "blue",
) {
  const fill = color === "green" ? "#16A34A" : "#2563EB";
  return L.divIcon({
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
    html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${fill}"/>
      <circle cx="14" cy="14" r="5.5" fill="white"/>
    </svg>`,
  });
}

function NearbyOsmMap({
  property,
  places,
}: {
  property: NearbyMapProperty;
  places: readonly {
    id: string;
    placeName: string;
    walkTime: string;
    latitude?: number;
    longitude?: number;
  }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const [ready, setReady] = useState(false);

  const propertyLat = property.latitude;
  const propertyLng = property.longitude;

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      if (propertyLat == null || propertyLng == null) return;

      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: true,
      }).setView([propertyLat, propertyLng], 14);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        },
      ).addTo(map);

      mapRef.current = map;
      setReady(true);

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    }

    void initMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [propertyLat, propertyLng]);

  useEffect(() => {
    if (!ready || !mapRef.current || propertyLat == null || propertyLng == null) {
      return;
    }

    const centerLat = propertyLat;
    const centerLng = propertyLng;
    let cancelled = false;

    async function syncMarkers() {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const greenIcon = createDivIcon(L, "green");
      const blueIcon = createDivIcon(L, "blue");
      const bounds: [number, number][] = [[centerLat, centerLng]];

      const rentLabel = formatRentLabel(property.startingRent);

      const propertyPopup = `
        <div style="display:flex;gap:10px;align-items:center;min-width:180px;font-family:inherit">
          ${
            property.imageSrc
              ? `<img src="${property.imageSrc}" alt="" width="56" height="56" style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0" />`
              : ""
          }
          <div>
            <div style="font-weight:700;font-size:13px;color:#111827">${property.name}</div>
            ${
              property.locality
                ? `<div style="font-size:12px;color:#6B7280;margin-top:2px">${property.locality}</div>`
                : ""
            }
            ${
              rentLabel
                ? `<div style="font-size:12px;font-weight:600;color:#111827;margin-top:2px">${rentLabel}</div>`
                : ""
            }
          </div>
        </div>
      `;

      const propertyMarker = L.marker([centerLat, centerLng], {
        icon: greenIcon,
        zIndexOffset: 1000,
      })
        .addTo(mapRef.current)
        .bindPopup(propertyPopup, { maxWidth: 280 });
      markersRef.current.push(propertyMarker);
      propertyMarker.openPopup();

      for (const place of places) {
        if (place.latitude == null || place.longitude == null) continue;
        bounds.push([place.latitude, place.longitude]);
        const marker = L.marker([place.latitude, place.longitude], {
          icon: blueIcon,
        })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div style="font-family:inherit"><strong style="font-size:13px">${place.placeName}</strong>${
              place.walkTime
                ? `<div style="font-size:12px;color:#6B7280;margin-top:2px">${place.walkTime}</div>`
                : ""
            }</div>`,
          );
        markersRef.current.push(marker);
      }

      if (bounds.length > 1) {
        mapRef.current.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
      } else {
        mapRef.current.setView([centerLat, centerLng], 14);
      }

      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
      });
    }

    void syncMarkers();

    return () => {
      cancelled = true;
    };
  }, [ready, places, property, propertyLat, propertyLng]);

  if (propertyLat == null || propertyLng == null) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-gray-100 px-6 text-center text-sm text-gray-600">
        Map location is not available for this property yet.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100 [&_.leaflet-popup-content-wrapper]:rounded-xl [&_.leaflet-popup-content-wrapper]:shadow-lg [&_.leaflet-popup-content]:m-3"
    />
  );
}

export function HdpNearbyMapModal({
  open,
  onClose,
  property,
  categories,
  activeCategoryId,
  onCategoryChange,
}: HdpNearbyMapModalProps) {
  const titleId = useId();
  const activeCategory = useMemo(
    () =>
      categories.find((item) => item.id === activeCategoryId) ??
      categories[0] ??
      null,
    [categories, activeCategoryId],
  );

  const places = useMemo(
    () =>
      (activeCategory?.options ?? []).filter(
        (place) => place.latitude != null && place.longitude != null,
      ),
    [activeCategory],
  );

  const addressLine =
    property.addressLine ||
    [property.locality].filter(Boolean).join(", ") ||
    undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel="Close nearby map"
      maxWidthClassName="md:max-w-5xl"
      className="flex max-h-[min(92dvh,calc(100dvh-3.5rem))] flex-col p-0 sm:p-0 md:max-h-[calc(100dvh-2rem)] md:p-0"
    >
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2
            id={titleId}
            className="truncate text-xl font-bold tracking-tight text-gray-900 md:text-2xl"
          >
            {property.name}
          </h2>
          {addressLine ? (
            <p className="mt-1 truncate text-sm text-gray-500">{addressLine}</p>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-5 pt-4 sm:px-6">
        <div className="h-[min(52vh,420px)] w-full md:h-[min(58vh,480px)]">
          {open ? (
            <NearbyOsmMap property={property} places={places} />
          ) : null}
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => {
            const isActive = category.id === activeCategory?.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "inline-flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-center transition-colors",
                  "min-w-[5.5rem] max-w-[7.5rem]",
                  isActive
                    ? "bg-blue-light-100 text-blue-light-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                <span aria-hidden className="text-lg leading-none">
                  {category.emoji}
                </span>
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight">
                  {category.modalLabel ?? category.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
