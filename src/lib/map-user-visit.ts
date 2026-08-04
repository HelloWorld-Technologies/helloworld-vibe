import type { MyVisitItem, UserVisitApiItem } from "@/src/models/user-visit";
import { srpCardDefaultImage } from "@/src/tokens/srp-card";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseAddress(item: UserVisitApiItem): string {
  if (typeof item.address === "string") {
    return item.address;
  }

  if (item.address && typeof item.address === "object") {
    return [item.address.line1, item.address.line2].filter(Boolean).join(", ");
  }

  return [item.locality, item.city].filter(Boolean).join(", ");
}

function parseImages(item: UserVisitApiItem): string[] {
  const fromList = item.images ?? item.property_image;
  if (Array.isArray(fromList) && fromList.length > 0) {
    return fromList
      .filter((image) => typeof image === "string" && image.length > 0)
      .map((image) =>
        image.includes("coming-soon") ? srpCardDefaultImage : image,
      );
  }

  const single = item.image ?? item.hdp_image;
  if (!single) return [srpCardDefaultImage];
  return [single.includes("coming-soon") ? srpCardDefaultImage : single];
}

function parseVisitDate(item: UserVisitApiItem): Date | null {
  const raw = item.visit_date ?? item.date;
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTimeLabel(
  startTime?: string,
  endTime?: string,
  fallback?: string,
): string {
  if (fallback) return fallback;

  const formatPart = (time: string) => {
    const [hourPart, minutePart = "00"] = time.split(":");
    const hour = Number.parseInt(hourPart, 10);
    if (!Number.isFinite(hour)) return time;

    const minute = minutePart.padStart(2, "0");
    if (hour === 12) return `12:${minute} PM`;
    if (hour > 12) return `${hour - 12}:${minute} PM`;
    return `${hour}:${minute} AM`;
  };

  if (startTime && endTime) {
    return `${formatPart(startTime)} - ${formatPart(endTime)}`;
  }

  if (startTime) {
    return formatPart(startTime);
  }

  return "Time to be confirmed";
}

function getDaysUntilLabel(date: Date): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} Days`;
}

function isPastVisit(date: Date, status?: string): boolean {
  const normalized = status?.toLowerCase();
  if (
    normalized === "past" ||
    normalized === "completed" ||
    normalized === "cancelled"
  ) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return target.getTime() < today.getTime();
}

export function mapUserVisitApiItem(item: UserVisitApiItem): MyVisitItem | null {
  const visitDate = parseVisitDate(item);
  const propertyId = readNumber(item.property_id);
  if (!visitDate || !propertyId) return null;

  const propertyName =
    readString(item.property_name) ??
    readString(item.display_name) ??
    readString(item.name) ??
    "HelloWorld Property";

  const locality = readString(item.locality);
  const city = readString(item.city);
  const subtitle = locality
    ? `PG in ${locality}`
    : city
      ? `Coliving PG in ${city}`
      : "Scheduled property visit";

  const managerName =
    readString(item.property_manager?.name) ??
    readString(item.manager_name) ??
    "Property Manager";

  const managerPhone =
    readString(item.property_manager?.phone) ?? readString(item.manager_phone);

  const mapUrl =
    readString(item.map_url) ??
    readString(item.directions_url) ??
    (item.latitude != null && item.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
      : undefined);

  const visitId = String(item.id ?? item.visit_id ?? `${propertyId}-${visitDate.toISOString()}`);
  const past = isPastVisit(visitDate, item.status);
  const propertyRating = item.rating?.property;
  const managerRating = item.rating?.manager;

  return {
    id: visitId,
    propertyId,
    propertyName,
    subtitle,
    addressLabel: parseAddress(item),
    images: parseImages(item),
    visitDate,
    timeLabel: formatTimeLabel(
      readString(item.start_time),
      readString(item.end_time),
      readString(item.time) ?? readString(item.time_slot),
    ),
    dayLabel: visitDate.toLocaleDateString("en-IN", { weekday: "long" }),
    propertyManagerName: managerName,
    propertyManagerPhone: managerPhone,
    mapUrl,
    propertyUrl: readString(item.property_url) ?? readString(item.href),
    isPast: past,
    daysUntilLabel: past ? null : getDaysUntilLabel(visitDate),
    canRate: past && !(propertyRating && managerRating),
    propertyRating,
    managerRating,
  };
}

export function mapUserVisitApiItems(items: UserVisitApiItem[]): MyVisitItem[] {
  return items
    .map(mapUserVisitApiItem)
    .filter((item): item is MyVisitItem => item != null)
    .sort((left, right) => right.visitDate.getTime() - left.visitDate.getTime());
}

export function formatVisitDateBox(date: Date) {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

export function formatVisitCardDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
