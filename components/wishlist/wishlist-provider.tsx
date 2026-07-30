"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addWishlistProperty,
  fetchWishlistPropertyIds,
  removeWishlistProperty,
} from "@/src/apis/wishlist";
import { postSendOtp, postVerifyOtp } from "@/src/apis/user";
import { WishlistAuthModal } from "@/components/wishlist/wishlist-auth-modal";
import {
  WishlistSnackbar,
  type WishlistSnackbarState,
} from "@/components/wishlist/wishlist-snackbar";
import {
  getStoredMobile,
  isLoggedIn,
  refreshAfterLogin,
} from "@/src/lib/auth-storage";

type PendingWishlistItem = {
  propertyId: number;
  propertyName?: string;
};

interface WishlistContextValue {
  isWishlisted: (propertyId: number) => boolean;
  toggleWishlist: (
    propertyId: number,
    propertyName?: string,
  ) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isLoading: boolean;
  revision: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function buildWishlistSnackbar(
  shouldSave: boolean,
  propertyName?: string,
  failed = false,
): WishlistSnackbarState {
  if (failed) {
    return {
      message: "Could not update your wishlist. Please try again.",
      variant: "error",
    };
  }

  if (shouldSave) {
    return {
      message: propertyName
        ? `${propertyName} saved to wishlist`
        : "Property saved to wishlist",
      action: { label: "View wishlist", href: "/wishlist" },
    };
  }

  return {
    message: propertyName
      ? `${propertyName} removed from wishlist`
      : "Removed from wishlist",
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingWishlist, setPendingWishlist] =
    useState<PendingWishlistItem | null>(null);
  const [snackbar, setSnackbar] = useState<WishlistSnackbarState | null>(null);
  const [revision, setRevision] = useState(0);

  const showSnackbar = useCallback((next: WishlistSnackbarState) => {
    setSnackbar(next);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(null);
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!isLoggedIn()) {
      setWishlistIds(new Set());
      return;
    }

    setIsLoading(true);
    const ids = await fetchWishlistPropertyIds();
    setWishlistIds(new Set(ids));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = useCallback(
    (propertyId: number) => wishlistIds.has(propertyId),
    [wishlistIds],
  );

  const applyWishlistChange = useCallback(
    async (
      propertyId: number,
      shouldSave: boolean,
      propertyName?: string,
    ) => {
      setWishlistIds((current) => {
        const next = new Set(current);
        if (shouldSave) {
          next.add(propertyId);
        } else {
          next.delete(propertyId);
        }
        return next;
      });

      const response = shouldSave
        ? await addWishlistProperty(propertyId)
        : await removeWishlistProperty(propertyId);

      if (!response.success) {
        setWishlistIds((current) => {
          const next = new Set(current);
          if (shouldSave) {
            next.delete(propertyId);
          } else {
            next.add(propertyId);
          }
          return next;
        });
        showSnackbar(buildWishlistSnackbar(shouldSave, propertyName, true));
        return;
      }

      showSnackbar(buildWishlistSnackbar(shouldSave, propertyName));
      setRevision((current) => current + 1);
    },
    [showSnackbar],
  );

  const closeAuthModal = useCallback(() => {
    setAuthOpen(false);
    setAuthStep("phone");
    setOtp("");
    setAuthError(null);
    setPendingWishlist(null);
  }, []);

  const completePendingWishlist = useCallback(async () => {
    if (!pendingWishlist) return;
    const { propertyId, propertyName } = pendingWishlist;
    setPendingWishlist(null);
    await applyWishlistChange(propertyId, true, propertyName);
  }, [applyWishlistChange, pendingWishlist]);

  const toggleWishlist = useCallback(
    async (propertyId: number, propertyName?: string) => {
      if (!isLoggedIn()) {
        setPendingWishlist({ propertyId, propertyName });
        setPhone(getStoredMobile()?.replace(/\D/g, "").slice(-10) ?? "");
        setAuthStep("phone");
        setAuthError(null);
        setAuthOpen(true);
        return;
      }

      await applyWishlistChange(
        propertyId,
        !wishlistIds.has(propertyId),
        propertyName,
      );
    },
    [applyWishlistChange, wishlistIds],
  );

  const handleSendOtp = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    const response = await postSendOtp({ mobile: phone });
    setAuthLoading(false);

    if (response.Status === "Success") {
      setAuthStep("otp");
      return;
    }

    setAuthError(response.message ?? "Could not send OTP. Please try again.");
  }, [phone]);

  const handleVerifyOtp = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    const response = await postVerifyOtp({
      mobile: phone,
      otp: Number.parseInt(otp, 10),
      session_id: "kyun-chahiye",
    });
    setAuthLoading(false);

    if (!response.success) {
      setAuthError("Invalid OTP. Please try again.");
      return;
    }

    await refreshWishlist();
    setAuthOpen(false);
    setAuthStep("phone");
    setOtp("");
    setAuthError(null);
    await completePendingWishlist();
    refreshAfterLogin();
  }, [completePendingWishlist, otp, phone, refreshWishlist]);

  const value = useMemo(
    () => ({
      isWishlisted,
      toggleWishlist,
      refreshWishlist,
      isLoading,
      revision,
    }),
    [isLoading, isWishlisted, refreshWishlist, revision, toggleWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <WishlistSnackbar state={snackbar} onClose={hideSnackbar} />
      <WishlistAuthModal
        open={authOpen}
        onClose={closeAuthModal}
        loading={authLoading}
        errorMessage={authError}
        step={authStep}
        phone={phone}
        otp={otp}
        onPhoneChange={setPhone}
        onOtpChange={setOtp}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onEditPhone={() => {
          setAuthStep("phone");
          setOtp("");
          setAuthError(null);
        }}
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}

export function useOptionalWishlist() {
  return useContext(WishlistContext);
}
