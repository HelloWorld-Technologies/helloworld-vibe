import type { CategoryProps } from "@/src/models/category";
import { getInventoryTypeLabel } from "@/src/constants/inventory-types";
import { hdpOccupancies, type HdpOccupancy } from "@/src/tokens/hdp";

function visibleCategory(category: CategoryProps) {
  return category.show_to_ui && !category.is_removed;
}

/** True only for multi-bed sharing (2SHARING+), not PRIVATE / Classic+ / 1SHARING. */
export function isSharingInventoryType(inventoryType?: string): boolean {
  const normalized = String(inventoryType || "")
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!normalized.includes("SHARING")) return false;
  const match = normalized.match(/^(\d+)SHARING$/);
  if (match) return Number.parseInt(match[1], 10) >= 2;
  return normalized === "SHARING";
}

function sharingCountFromInventoryType(inventoryType: string): number | null {
  const normalized = inventoryType.toUpperCase().replace(/\s+/g, "");
  const match = normalized.match(/^(\d+)SHARING$/);
  if (match) return Number.parseInt(match[1], 10);
  return null;
}

export function categorySupportsPrivate(category: CategoryProps): boolean {
  if (!isSharingInventoryType(category.inventory_type)) return true;
  return (category.private_rent ?? 0) > 0;
}

export function categorySharingOccupancy(
  category: CategoryProps,
): HdpOccupancy | null {
  if (!isSharingInventoryType(category.inventory_type)) return null;

  const sharingCount = sharingCountFromInventoryType(
    category.inventory_type ?? "",
  );
  if (sharingCount === 2) return "double";
  if (sharingCount === 3) return "triple";
  if (sharingCount === 4) return "quadruple";

  const beds = category.beds_per_room || category.maximum_occupancy;
  if (beds === 2) return "double";
  if (beds === 3) return "triple";
  if (beds >= 4) return "quadruple";

  return null;
}

export function categoryMatchesOccupancy(
  category: CategoryProps,
  occupancy: HdpOccupancy,
): boolean {
  if (!visibleCategory(category)) return false;

  if (occupancy === "private") {
    return categorySupportsPrivate(category);
  }

  return categorySharingOccupancy(category) === occupancy;
}

export function getRentForOccupancy(
  category: CategoryProps,
  occupancy: HdpOccupancy,
): number {
  if (occupancy === "private") {
    if (isSharingInventoryType(category.inventory_type)) {
      return category.private_rent ?? category.private_offer_rent ?? 0;
    }
    return category.rent ?? category.offer_rent ?? 0;
  }
  return category.rent ?? category.offer_rent ?? 0;
}

export function getAvailableOccupancies(
  categories: readonly CategoryProps[],
): HdpOccupancy[] {
  const visible = categories.filter(visibleCategory);
  return hdpOccupancies
    .map((item) => item.id)
    .filter((occupancy) =>
      visible.some((category) => categoryMatchesOccupancy(category, occupancy)),
    );
}

export function filterCategoriesByOccupancy(
  categories: readonly CategoryProps[],
  occupancy: HdpOccupancy,
): CategoryProps[] {
  return categories.filter((category) =>
    categoryMatchesOccupancy(category, occupancy),
  );
}

export function getBookingRoomChipLabel(
  category: CategoryProps,
  occupancy: HdpOccupancy,
): string {
  const raw = category.inventory_type ?? "";
  const normalized = raw.toUpperCase().replace(/\s+/g, "");

  if (occupancy === "private") {
    if (normalized.includes("BHK") || normalized.includes("RK")) {
      return getInventoryTypeLabel(raw);
    }
    if (!isSharingInventoryType(raw)) {
      return getInventoryTypeLabel(raw) || "Private Room";
    }
    return "Private Room";
  }

  return "Bed";
}

export function getFallbackRoomChipLabel(occupancy: HdpOccupancy): string {
  return occupancy === "private" ? "Private Room" : "Bed";
}
