/**
 * Shared horizontal shell widths and padding for marketing, blog, and chrome.
 */
export const pageShell = {
  chrome: "mx-auto max-w-7xl px-4 sm:px-6",
  footer: "mx-auto max-w-7xl px-6 py-6 lg:px-10 xl:px-20 lg:py-16",
  showcase: "mx-auto max-w-7xl px-4 sm:px-6",
  errorContent: "w-full max-w-lg",
  homepage: "mx-auto max-w-7xl px-4 sm:px-6",
  homepageHero: "relative mx-auto max-w-7xl px-4 sm:px-6",
  homepageHeroCopy: "max-w-[36rem]",
  homepageBenefits: "mx-auto max-w-[66.375rem] px-4 sm:px-6",
  blogIndex: "mx-auto w-full max-w-6xl px-4 py-8 md:py-10",
  blogArticle: "mx-auto w-full max-w-3xl px-4 py-10",
  sitemap: "mx-auto w-full max-w-5xl px-4 py-10",
  community: "mx-auto max-w-7xl px-4 sm:px-6",
  communityIntro: "mx-auto max-w-3xl text-center",
  communityHeroDesktop:
    "mx-auto hidden max-w-[72.79rem] px-4 sm:px-6 lg:block",
  communityMobileHero: "mx-auto max-w-md",
} as const;

/**
 * Page layout tokens aligned with helloworld-next HDP container
 * (src/containers/HDP/index.tsx): max-w-7xl shell, 60% / 35% two-column at md+.
 */
export const pageLayout = {
  container: "mx-auto max-w-7xl px-4 sm:px-6",
  containerWithTopPadding: "mx-auto max-w-7xl px-4 pt-4 sm:px-6 md:py-6 ",
  // items-stretch (not items-start) so the sidebar is as tall as the main
  // column — required for md:sticky contact cards to have room to stick.
  twoColumn: "md:flex md:items-stretch md:justify-between md:gap-8",
  hdpTwoColumn:
    "mt-8 md:mt-10 md:flex md:items-stretch md:justify-between md:gap-2",
  mainColumn: "min-w-0 md:max-w-[70%]",
  sidebarColumn: "hidden md:block md:w-[35%] md:shrink-0 md:px-3",
  hdpSidebarColumn:
    "hidden md:block md:w-[35%] md:min-w-[18rem] md:max-w-[29.6875rem] md:shrink-0 md:px-3",
  mobileStickyBottomPadding: "pb-24 md:pb-0",
} as const;
