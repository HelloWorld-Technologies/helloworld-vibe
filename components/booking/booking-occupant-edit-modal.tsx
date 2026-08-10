"use client";

import { useEffect, useId, useState } from "react";
import { OccupantDetailsForm } from "@/components/booking/occupant-details-form";
import { Modal, ModalTitle } from "@/components/ui/modal";
import type { BookingOccupantInfo } from "@/src/lib/booking/url";

export function BookingOccupantEditModal({
  open,
  onClose,
  initialValues,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialValues: BookingOccupantInfo & { moveInDate: string };
  onSave: (
    details: BookingOccupantInfo & { moveInDate: string },
  ) => void;
}) {
  const titleId = useId();
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    if (open) setSessionKey((current) => current + 1);
  }, [open, initialValues]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel="Close occupant details"
      maxWidthClassName="max-w-lg"
      className="p-5 sm:p-6"
    >
      <ModalTitle id={titleId} className="text-xl">
        Edit your details
      </ModalTitle>
      <div className="mt-4">
        {open ? (
          <OccupantDetailsForm
            key={sessionKey}
            onBack={onClose}
            initialValues={initialValues}
            onComplete={(details) => {
              onSave(details);
              onClose();
            }}
          />
        ) : null}
      </div>
    </Modal>
  );
}
