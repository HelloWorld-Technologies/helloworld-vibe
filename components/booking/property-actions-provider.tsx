"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { RequestCallbackModal } from "@/components/booking/request-callback-modal";
import { ScheduleVisitModal } from "@/components/booking/schedule-visit-modal";

export interface PropertyActionTarget {
  propertyId: number;
  propertyName: string;
  location?: string;
  city?: string;
  propertyUrl?: string;
}

interface PropertyActionsContextValue {
  openRequestCallback: (target: PropertyActionTarget) => void;
  openScheduleVisit: (target: PropertyActionTarget) => void;
}

const PropertyActionsContext = createContext<PropertyActionsContextValue | null>(
  null,
);

export function PropertyActionsProvider({
  children,
  defaultCity,
  defaultLocation,
}: {
  children: ReactNode;
  defaultCity?: string;
  defaultLocation?: string;
}) {
  const [callbackTarget, setCallbackTarget] =
    useState<PropertyActionTarget | null>(null);
  const [visitTarget, setVisitTarget] = useState<PropertyActionTarget | null>(
    null,
  );

  const openRequestCallback = useCallback((target: PropertyActionTarget) => {
    setCallbackTarget(target);
  }, []);

  const openScheduleVisit = useCallback((target: PropertyActionTarget) => {
    setVisitTarget(target);
  }, []);

  const value = useMemo(
    () => ({ openRequestCallback, openScheduleVisit }),
    [openRequestCallback, openScheduleVisit],
  );

  return (
    <PropertyActionsContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <RequestCallbackModal
          open={callbackTarget != null}
          onClose={() => setCallbackTarget(null)}
          propertyName={callbackTarget?.propertyName ?? ""}
          location={callbackTarget?.location ?? defaultLocation}
          city={callbackTarget?.city ?? defaultCity}
        />
      </Suspense>
      <ScheduleVisitModal
        open={visitTarget != null}
        onClose={() => setVisitTarget(null)}
        propertyId={visitTarget?.propertyId ?? 0}
        propertyName={visitTarget?.propertyName ?? ""}
        propertyUrl={visitTarget?.propertyUrl}
      />
    </PropertyActionsContext.Provider>
  );
}

export function usePropertyActions() {
  const context = useContext(PropertyActionsContext);
  if (!context) {
    throw new Error(
      "usePropertyActions must be used within PropertyActionsProvider",
    );
  }
  return context;
}

export function useOptionalPropertyActions() {
  return useContext(PropertyActionsContext);
}
