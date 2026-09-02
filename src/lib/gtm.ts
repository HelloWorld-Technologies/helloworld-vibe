type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

export function gtag(arg: DataLayerObject) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(arg);
  }
}

export function updateGtmEvent(obj: DataLayerObject) {
  gtag(obj);
}

export function trackContactLead(params: { name: string; phone: string }) {
  try {
    updateGtmEvent({
      name: params.name,
      phone_number: `+91${params.phone}`,
    });
  } catch {
    // GTM is optional; ignore tracking failures.
  }
}

export function trackLeadConversion(params: {
  name: string;
  phone: string;
  city?: string | number;
  utmSource?: string;
  student?: boolean;
}) {
  try {
    const event = params.student
      ? "generate_lead_student"
      : "generate_lead_coliving";

    updateGtmEvent({
      name: params.name,
      phone_number: `+91${params.phone}`,
    });

    updateGtmEvent({
      event,
      cityOfInterest: params.city,
      utmSource: params.utmSource,
    });
  } catch {
    // GTM is optional; ignore tracking failures.
  }
}

export function trackVisitScheduled(params: {
  name: string;
  phone?: string;
  email: string;
}) {
  try {
    updateGtmEvent({
      name: params.name,
      phone_number: params.phone ? `+91${params.phone}` : undefined,
      email: params.email,
    });
  } catch {
    // GTM is optional; ignore tracking failures.
  }
}
