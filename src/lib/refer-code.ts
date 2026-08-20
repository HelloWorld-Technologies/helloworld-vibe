/** localStorage key for referral codes captured via `/refer?code=…`. */
export const REFER_CODE_STORAGE_KEY = "referCode";

export function readReferCode(): string | null {
  if (typeof window === "undefined") return null;
  const code = window.localStorage.getItem(REFER_CODE_STORAGE_KEY)?.trim();
  return code || null;
}

export function storeReferCode(code: string): void {
  if (typeof window === "undefined") return;
  const trimmed = code.trim();
  if (!trimmed) return;
  window.localStorage.setItem(REFER_CODE_STORAGE_KEY, trimmed);
}

export function clearReferCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFER_CODE_STORAGE_KEY);
}
