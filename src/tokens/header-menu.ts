export type HeaderMenuItemId =
  | "contact"
  | "visits"
  | "wishlist"
  | "community"
  | "homeowners"
  | "living"
  | "about"
  | "privacy"
  | "tenancy"
  | "login"
  | "logout";

export type HeaderMenuItem = {
  id: HeaderMenuItemId;
  label: string;
  href?: string;
  action?: "login" | "logout";
};

const headerMenuItemsBase: Omit<HeaderMenuItem, "action">[] = [
  { id: "contact", label: "Contact Us", href: "/contact" },
  { id: "visits", label: "My Visits", href: "/my-visits" },
  { id: "wishlist", label: "My Wishlist", href: "/wishlist" },
  { id: "community", label: "Community Events", href: "/community" },
  { id: "homeowners", label: "For Homeowners", href: "/owner" },
  { id: "living", label: "HelloWorld Living", href: "/hello-world-living" },
  { id: "about", label: "About", href: "/about-us" },
  { id: "privacy", label: "Privacy Policy", href: "/policy" },
  { id: "tenancy", label: "Tenancy Policy", href: "/tenant-policy" },
];

export function getHeaderMenuItems(isLoggedIn: boolean): HeaderMenuItem[] {
  return [
    ...headerMenuItemsBase,
    isLoggedIn
      ? { id: "logout", label: "Logout", action: "logout" }
      : { id: "login", label: "Login", action: "login" },
  ];
}

/** @deprecated Use getHeaderMenuItems instead */
export const headerMenuItems = getHeaderMenuItems(true);

export const headerMenuSampleUserPhone = "+91-9934554567";
