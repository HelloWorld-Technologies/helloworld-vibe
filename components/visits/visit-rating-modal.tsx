"use client";

import Image from "next/image";
import { useState } from "react";
import { StarRating } from "@/components/visits/star-rating";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { submitVisitRating } from "@/src/apis/visit";
import { formatVisitCardDate } from "@/src/lib/map-user-visit";
import type { MyVisitItem } from "@/src/models/user-visit";

export interface VisitRatingModalProps {
  visit: MyVisitItem | null;
  open: boolean;
  onClose: () => void;
  onSubmitted?: (visitId: string) => void;
}

export function VisitRatingModal({
  visit,
  open,
  onClose,
  onSubmitted,
}: VisitRatingModalProps) {
  const [propertyRating, setPropertyRating] = useState(0);
  const [managerRating, setManagerRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visit) return null;

  const image = visit.images[0];
  const canSubmit = propertyRating > 0 && managerRating > 0 && !loading;

  async function handleSubmit() {
    if (!visit || !canSubmit) return;

    setLoading(true);
    setError(null);

    const response = await submitVisitRating({
      visitId: visit.id,
      propertyRating,
      managerRating,
    });

    setLoading(false);

    if (!response.success) {
      setError("Could not submit your rating. Please try again.");
      return;
    }

    onSubmitted?.(visit.id);
    setPropertyRating(0);
    setManagerRating(0);
    onClose();
  }

  function handleClose() {
    if (loading) return;
    setPropertyRating(0);
    setManagerRating(0);
    setError(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeLabel="Close rating dialog"
      maxWidthClassName="max-w-md"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-bold text-gray-900">
              {visit.propertyName}
            </p>
            <p className="line-clamp-2 text-xs text-gray-600">
              {visit.addressLabel}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {formatVisitCardDate(visit.visitDate)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-gray-900">
            Rate your visit to {visit.propertyName}
          </p>
          <StarRating value={propertyRating} onChange={setPropertyRating} />
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-gray-900">
            How would you rate our Property Manager {visit.propertyManagerName}?
          </p>
          <StarRating value={managerRating} onChange={setManagerRating} />
        </div>

        {error ? <p className="text-center text-sm text-error-600">{error}</p> : null}

        <div className="flex gap-3">
          <Button
            type="button"
            hierarchy="secondary-gray"
            className="flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
