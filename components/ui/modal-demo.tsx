"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/ui/login-modal";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(phone: string) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setOpen(false);
    console.info("Login submitted:", phone);
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button hierarchy="primary" onClick={() => setOpen(true)}>
        Open login modal
      </Button>
      <p className="max-w-md text-sm text-gray-600">
        Phone login overlay with dimmed backdrop, floating close button, and
        terms link. Press Escape or click outside to close.
      </p>

      <LoginModal
        open={open}
        onClose={() => setOpen(false)}
        onLogin={handleLogin}
        loading={loading}
      />
    </div>
  );
}
